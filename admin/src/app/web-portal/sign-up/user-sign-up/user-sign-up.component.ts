import { Component, NgModule, OnInit,ViewChild } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { Router }      from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

import { Observable, of } from 'rxjs';
import {first , tap, delay,map } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import {DatePipe} from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { AlertService } from '../../../_alert';


import {FormControl, FormGroup, FormsModule, FormBuilder, FormArray, Validators} from '@angular/forms';

import { HomePageService } from './../../_services';

@Component({
  selector: 'vex-user-sign-up',
  templateUrl: './user-sign-up.component.html',
  styleUrls: ['./user-sign-up.component.scss']
})
export class UserSignUpComponent implements OnInit {
  
  signup_images = [];
  testImagesource={img_executive:'',img_spouse:'',img_nominee:'',sign_executive:'',sign_spouse:'',sign_nominee:''};
  companyList:any;
  imagePath:any;
  otpShow=0;
  otpButtn = 0;
  signupForm: FormGroup;
  dumy:any;
  afterValid = 0;
  sentotp:any;
  today:Date;
  isSubmitted = false;
  reotpButtn:boolean=false;
  isReadonly:boolean=false;
  constructor( public alertService:AlertService,
               public authService: AuthService,
               private router:Router,
               private datePipe:DatePipe,
               private spinner: NgxSpinnerService,
               private fb: FormBuilder,
               private homePageService:HomePageService) { 
   }
   ngOnInit() {
     this.loadCompany();
     this.signupForm = this.fb.group({
       img_executive: new FormControl('',[Validators.required]),
       img_spouse: new FormControl(''),
       img_nominee: new FormControl(''),
       sign_executive: new FormControl('',[Validators.required]),
       sign_spouse: new FormControl(''),
       sign_nominee: new FormControl(''),
       email: new FormControl('',[Validators.required,Validators.email,Validators.pattern(/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/)]),
       mobile:new FormControl('', [Validators.compose([
                                                      Validators.minLength(10),
                                                      //Validators.maxLength(10),
                                                      Validators.pattern(/^-?(0|[1-9]\d*)?$/),
                                                      Validators.required
                                                    ]) ]),
        firstname:new FormControl('',[Validators.required]),
        lastname:new FormControl('',[Validators.required]),
        spouse_name:new FormControl(''),
        date_of_joining:new FormControl(''),
        date_of_retierment:new FormControl('',[Validators.required]),
        designation:new FormControl(''), 
        nominee_relationship:new FormControl(''),
        nominee_name:new FormControl(''),
        nominee_address:new FormControl(''),
        permanent_address:new FormControl('',[Validators.required]),
        present_address:new FormControl('',[Validators.required]),
        company_id:new FormControl('',[Validators.required]),
        employee_id:new FormControl('',[Validators.required]),
       // company_id_opted:new FormControl('',[Validators.required]),
        password: ['', [Validators.required, Validators.minLength(6)]],
        gender:new FormControl('',[Validators.required]),
        date_of_birth:new FormControl('',[Validators.required]),
        medical_card_number:new FormControl('',[Validators.required]),
        eis_number:new FormControl('',[Validators.required]),
        pan_number:new FormControl('', [Validators.compose([
                                                      Validators.minLength(10),
                                                      //Validators.maxLength(10),
                                                      Validators.pattern(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/),
                                                      Validators.required
                                                    ]) ]),
        adhaar_number:new FormControl('',[Validators.compose([
                                                      Validators.minLength(10),
                                                      //Validators.maxLength(10),
                                                      Validators.pattern(/^-?(0|[1-9]\d*)?$/),
                                                      Validators.required
                                                    ]) ]),
    });
    this.today = new Date();
  }
  
omit_text(event) {
      var key;
      key = event.charCode;  //         key = event.keyCode;  (Both can be used)
      return ((key >= 48 && key <= 57));
    }

  loadCompany(){
    this.homePageService.loadCompany().pipe(first()).subscribe(request => {
      if(request['status'])
        {
          this.companyList = request['result']
        }
      else{
         this.companyList = request['result'];
      } 
     });
  }
  sendOtp(mob,email){
    this.spinner.show();
    this.otpButtn=0;
    this.otpShow=1;
    this.reotpButtn = true;
    let condObj = {communication_details:mob,
                   communiaction_mode:'phone_no',
                   communication_mail:email,
                   };
    this.authService.sendOtp(condObj).pipe(first()).subscribe(request => {
      if(request['status'] == '1')
        {
          this.sentotp = request['result'].otp;
          this.alertService.clear();
          this.alertService.success(request['result'].otp);
        }
      else{
          this.otpShow=0;
          this.reotpButtn = false;
          this.alertService.clear();
          this.alertService.error(request['message']);
      } 
      this.spinner.hide();
     });
  }

  verifyOtp(otp){
    if(otp.length >= 4){
      if(otp == this.sentotp){
        this.reotpButtn = false;
        this.afterValid = 1;
        this.isReadonly = true;
        this.alertService.clear();
      }
      else
      {
         this.alertService.clear();
         this.alertService.error('Invalid Otp');
      }
      
    }
  }
  ShowButton(mob,email){
    if(mob && email && this.signupForm.controls.mobile.valid && this.signupForm.controls.email.valid){
      if(mob.length == 10){
        this.otpButtn=1;
      }
      else
      {
        this.otpButtn=0;
      }
   }
   else
      {
        this.otpButtn=0;
      }
  }
  importFile(event,index) {
    console.log(index);
    if (event.target.files.length == 0) {
       console.log("No file selected!");
       return
    }

      this.signup_images[index]=event.target.files[0]
      var reader = new FileReader();
      this.imagePath = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); 
      reader.onload = (_event) => { 
      this.testImagesource[index] = reader.result; 
      //console.log(this.testImagesource);
      }  
    }
    signupFormSubmit(){
      this.isSubmitted = true;
      console.log(this.signupForm.value);
      if(this.signupForm.valid)
      {
      this.spinner.show();
      let saveData = this.signupForm.value;
      const formData = new FormData();
      formData.append('email', saveData.email);
      formData.append('mobile', saveData.mobile);
      formData.append('firstname', saveData.firstname);
      formData.append('lastname', saveData.lastname);
      formData.append('spouse_name', saveData.spouse_name);
      formData.append('date_of_joining', this.datePipe.transform(saveData.date_of_joining,"MM-dd-yyyy"));
      formData.append('date_of_retierment', this.datePipe.transform(saveData.date_of_retierment,"MM-dd-yyyy"));
      formData.append('designation', saveData.designation);
      formData.append('nominee_relationship', saveData.nominee_relationship);
      formData.append('nominee_name', saveData.nominee_name);
      formData.append('nominee_address', saveData.nominee_address);
      formData.append('permanent_address', saveData.permanent_address);
      formData.append('present_address', saveData.present_address);
      formData.append('company_id', saveData.company_id);
      formData.append('password', saveData.password);
      formData.append('employee_id', saveData.employee_id);
      formData.append('gender', saveData.gender);
      formData.append('eis_number', saveData.eis_number);
      formData.append('pan_number', saveData.pan_number);
      formData.append('adhaar_number', saveData.adhaar_number);
      formData.append('medical_card_number', saveData.medical_card_number);
      formData.append('date_of_birth',this.datePipe.transform(saveData.date_of_birth,"MM-dd-yyyy"));
      formData.append('img_executive', this.signup_images['img_executive']);
      formData.append('img_spouse', this.signup_images['img_spouse']);
      formData.append('img_nominee', this.signup_images['img_nominee']);
      formData.append('sign_executive', this.signup_images['sign_executive']);
      formData.append('sign_spouse', this.signup_images['sign_spouse']);
      formData.append('sign_nominee', this.signup_images['sign_nominee']);
     
        this.authService.userSignUp(formData).pipe(first()).subscribe(res => {
          if(res['status'])
            {
             console.log(res);
             confirm(res['message']);
              location.href = '/';
             // this.authService.login(saveData.email, saveData.password).pipe(first()).subscribe(resp => {
             //    if(resp.status == 1){
             //       location.href = 'employee/dashboard';
             //    }
             // });
            }
          else{
             confirm(res['Something went wrong']);
          } 
          this.spinner.hide();
         });
      }
      else
      {
        this.alertService.clear();
        this.alertService.error('Some fields are mandatory');
        this.spinner.hide();
      }
      
    }

}



  


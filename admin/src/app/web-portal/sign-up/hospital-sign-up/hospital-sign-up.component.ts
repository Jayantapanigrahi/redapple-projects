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
  selector: 'vex-hospital-sign-up',
  templateUrl: './hospital-sign-up.component.html',
  styleUrls: ['./hospital-sign-up.component.scss']
})
export class HospitalSignUpComponent implements OnInit {

  
  signup_images = [];
  testImagesource={logo:'',bank_proof_document:''};
  cghsList:any;
  imagePath:any;
  otpShow:any=0;
  otpButtn = 0;
  signupForm: FormGroup;
  dumy:any;
  afterValid = 0;
  sentotp:any;
  reotpButtn:boolean=false;
  isSubmitted = false;
  isReadonly:boolean= false;
  constructor(
    public alertService:AlertService,
    public authService: AuthService,
    private router:Router,
    private datePipe:DatePipe, 
    private spinner: NgxSpinnerService,
    private fb: FormBuilder, 
    private homePageService:HomePageService) { 
   }
   ngOnInit() {
     this.signupForm = this.fb.group({
       bank_proof_document: new FormControl('',[Validators.required]),
       logo: new FormControl('',[Validators.required]),
       address: new FormControl('',[Validators.required]),
       hospital_url: new FormControl('',[Validators.required]),
       description: new FormControl('',[Validators.required]),
       name: new FormControl('',[Validators.required]),
       bank_account_number: new FormControl('',[Validators.required]),
       email: new FormControl('',[Validators.compose([Validators.required,Validators.email,Validators.pattern(/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/)]) ]),
       mobile:new FormControl('', [Validators.compose([
                                                      Validators.minLength(10),
                                                      Validators.pattern(/^-?(0|[1-9]\d*)?$/),
                                                      Validators.required
                                                    ]) ]),
        firstname:new FormControl('',[Validators.required]),
        lastname:new FormControl('',[Validators.required]),
        ifsc_code:new FormControl('',[Validators.required]),
        bank_name:new FormControl('',[Validators.required]),
        request_message:new FormControl(''), 
        password: ['', [Validators.required, Validators.minLength(6)]],
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
      console.log(request);
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
  omit_text(event) {
      var key;
      key = event.charCode;  //         key = event.keyCode;  (Both can be used)
      return ((key >= 48 && key <= 57));
    }
  verifyOtp(otp){
    if(otp.length >= 4){
      if(otp == this.sentotp){
        this.afterValid = 1;
        this.reotpButtn = false;
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
      formData.append('hospital_url', saveData.hospital_url);
      formData.append('lastname', saveData.lastname);
      formData.append('address', saveData.address);
      formData.append('name', saveData.name);
      formData.append('description', saveData.description);
      formData.append('bank_account_number', saveData.bank_account_number);
      formData.append('ifsc_code', saveData.ifsc_code);
      formData.append('bank_name', saveData.bank_name);
      formData.append('request_message', saveData.request_message);
      formData.append('password', saveData.password);
      formData.append('bank_proof_document', this.signup_images['bank_proof_document']);
      formData.append('logo', this.signup_images['logo']);
      

        this.authService.hospitalSignUp(formData).pipe(first()).subscribe(res => {
          if(res['status'])
            {
             console.log(res);
             confirm(res['message']);
             this.authService.login(saveData.email, saveData.password).pipe(first()).subscribe(resp => {
                if(resp.status == 1){
                location.href = 'hospital/dashboard';
                }
             });
            }
          else{
             confirm('Something went wrong');
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



  


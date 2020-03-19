
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


import {FormControl, FormGroup, FormsModule, FormBuilder, FormArray, Validators} from '@angular/forms';

import { HomePageService,EmployeeService } from './../../_services';

@Component({
  selector: 'vex-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export class EmployeeProfileComponent implements OnInit {
  
  signup_images = [];
  testImagesource={img_executive:'',img_spouse:'',img_nominee:'',sign_executive:'',sign_spouse:'',sign_nominee:''};
  companyList:any;
  imagePath:any;
  profileForm: FormGroup;
  dumy:any;
  afterValid = 0;
  sentotp:any;
  fdVAl:any;
  errorMsz:any;
  today:Date;
  compareDate:Date;
  ShowCounter:boolean;
  constructor(public authService: AuthService,
  	          private router:Router,
  	          private datePipe:DatePipe,
  	          private spinner: NgxSpinnerService,
  	          private fb: FormBuilder,
  	          private homePageService:HomePageService,
  	          public employeeService:EmployeeService) { 
      this.today = new Date();
   }
   ngOnInit() {
     this.loadCompany();
     this.employeeService.loadUserDetails({}).pipe(first()).subscribe(request => {
      if(request['status'])
        {
          this.fdVAl = request['result']
          console.log(this.fdVAl);
          this.profileForm = this.fb.group({
		       img_executive: new FormControl({value:'',disabled: true}),
		       img_spouse: new FormControl(''),
		       img_nominee: new FormControl(''),
		       sign_executive: new FormControl({value:'',disabled: true}),
		       sign_spouse: new FormControl(''),
		       sign_nominee: new FormControl(''),
           employee_id:new FormControl({value:this.fdVAl.employee.employee_id || '',disabled: true},[Validators.required]),
           company_id:new FormControl({value:this.fdVAl.employee.company_id || '',disabled: true}, Validators.required),
           medical_card_number:[{value:(!this.fdVAl.master)?'':this.fdVAl.master.medical_card_number,disabled: true}],
           eis_number:[{value:(!this.fdVAl.master)?'':this.fdVAl.master.eis_number,disabled: true}],
           bank_account_number:[(!this.fdVAl.master)?'':this.fdVAl.master.bank_account_number],
           ifsc_code:[(!this.fdVAl.master)?'':this.fdVAl.master.ifsc_code],
           bank_name:[(!this.fdVAl.master)?'':this.fdVAl.master.bank_name],
           pan_number:[{value:(!this.fdVAl.master)?'':this.fdVAl.master.pan_number,disabled: true}],
		       adhaar_number:[{value:(!this.fdVAl.master)?'':this.fdVAl.master.adhaar_number,disabled: true}],
           life_certificate_id:[(!this.fdVAl.master)?'':this.fdVAl.master.life_certificate_id],
           firstname:[{value:this.fdVAl.firstname || '',disabled: true}, Validators.required],
		       lastname:[{value:this.fdVAl.lastname || '',disabled: true}, Validators.required],
		       spouse_name:[this.fdVAl.employee.spouse_name || ''],
		       date_of_joining:[this.fdVAl.employee.date_of_joining || ''],
		       date_of_retierment:[{value:this.fdVAl.employee.date_of_retierment || '',disabled: true}, Validators.required],
           nominee_relationship:[this.fdVAl.nominee.nominee_relationship || ''],
		       nominee_name:[this.fdVAl.nominee.nominee_name || ''],
		       nominee_address:[this.fdVAl.nominee.nominee_address || ''],
		       permanent_address:[{value:this.fdVAl.employee.permanent_address || '',disabled: true}, Validators.required],
		       present_address:[{value:this.fdVAl.employee.present_address || '',disabled: true}, Validators.required],
           gender:[{value:this.fdVAl.employee.gender || '',disabled: true}, Validators.required],
           date_of_birth:[{value:this.fdVAl.employee.date_of_birth || '',disabled: true}, Validators.required],
		    });
           this.testImagesource.img_executive = this.fdVAl.employee.employee_image;
           this.testImagesource.img_spouse = this.fdVAl.employee.spouse_image;
           this.testImagesource.img_nominee = this.fdVAl.nominee.nominee_image;
           this.testImagesource.sign_executive = this.fdVAl.employee.employee_sign;
           this.testImagesource.sign_nominee = this.fdVAl.nominee.nominee_sign;
           this.testImagesource.sign_spouse = this.fdVAl.employee.spouse_sign;
           //Date Condition for 6 Month
           this.compareDate =  new Date(this.fdVAl.employee.created_at);
           this.compareDate.setMonth( this.compareDate.getMonth() + 6 )
           if(this.today > this.compareDate)
           {
             this.profileForm.disable();
             this.ShowCounter = false;
           }
           else{
             this.ShowCounter = true;
           }
        }
      else{
         this.fdVAl = [];
      } 
     });

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
    profileFormSubmit(){
      if(this.profileForm.valid)
      {
      this.spinner.show();
      let saveData = this.profileForm.value;
      const formData = new FormData();
      formData.append('ifsc_code', saveData.ifsc_code);
      formData.append('bank_name', saveData.bank_name);
      formData.append('bank_account_number', saveData.bank_account_number);
      formData.append('life_certificate_id', saveData.life_certificate_id);
      formData.append('spouse_name', saveData.spouse_name);
      formData.append('date_of_joining', this.datePipe.transform(saveData.date_of_joining,"MM-dd-yyyy"));
      formData.append('date_of_retierment', this.datePipe.transform(saveData.date_of_retierment,"MM-dd-yyyy"));
      formData.append('nominee_relationship', saveData.nominee_relationship);
      formData.append('nominee_name', saveData.nominee_name);
      formData.append('nominee_address', saveData.nominee_address);
      formData.append('img_executive', this.signup_images['img_executive']);
      formData.append('img_spouse', this.signup_images['img_spouse']);
      formData.append('img_nominee', this.signup_images['img_nominee']);
      formData.append('sign_executive', this.signup_images['sign_executive']);
      formData.append('sign_spouse', this.signup_images['sign_spouse']);
      formData.append('sign_nominee', this.signup_images['sign_nominee']);
      console.log(formData);
        this.employeeService.updateEmployee(formData).pipe(first()).subscribe(res => {
          if(res['status'] == '1')
            {
             console.log(res);
             confirm(res['message']);
            }
          else{
             confirm(res['Something went wrong']);
          } 
          this.spinner.hide();
         });
      }
      else
      {
        this.spinner.hide();
      }
      
    }

}



  


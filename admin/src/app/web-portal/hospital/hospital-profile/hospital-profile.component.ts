
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

import { HomePageService, HospitalService } from './../../_services';

@Component({
  selector: 'vex-hospital-profile',
  templateUrl: './hospital-profile.component.html',
  styleUrls: ['./hospital-profile.component.scss']
})
export class HospitalProfileComponent implements OnInit {

  
  signup_images = [];
  testImagesource={logo:'',bank_proof_document:''};
  imagePath:any;
  otpMsz = '';
  hospital_id:any;
  profileForm: FormGroup;
  fdVAl:any
  constructor(public authService: AuthService,public hospitalService: HospitalService,private router:Router,private datePipe:DatePipe, private spinner: NgxSpinnerService,private fb: FormBuilder, private homePageService:HomePageService) { 
   }
   ngOnInit() {
     this.hospitalService.loadAdminDetails({}).subscribe(request => {
      if(request['status'])
        {
       this.hospital_id = request['result'].user_hospital.id
       this.fdVAl = request['result'];
       console.log(this.fdVAl);
       this.profileForm = this.fb.group({
       bank_proof_document: new FormControl(''),
       logo: new FormControl(''),
       address: [ this.fdVAl.user_hospital.address || '', Validators.required],
       description: [this.fdVAl.user_hospital.description || '', Validators.required],
       name: [this.fdVAl.user_hospital.name || '', Validators.required],
       bank_account_number: [this.fdVAl.user_hospital.bank_account_number || '', Validators.required],
       firstname:[this.fdVAl.firstname || '', Validators.required],
       lastname:[this.fdVAl.lastname || '', Validators.required],
       ifsc_code:[this.fdVAl.user_hospital.ifsc_code || '', Validators.required],
       bank_name:[this.fdVAl.user_hospital.bank_name || '', Validators.required],
       //request_message:[this.fdVAl.user_hospital.request_message || '', Validators.required],
       });
     this.testImagesource.bank_proof_document = this.fdVAl.user_hospital.bank_proof_document;
     this.testImagesource.logo = this.fdVAl.user_hospital.logo;
    }
    else{
    	this.fdVAl = [];
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
    signupFormSubmit(){
      console.log(this.profileForm.value);
      if(this.profileForm.valid)
      {
      this.spinner.show();
      let saveData = this.profileForm.value;
      const formData = new FormData();
      formData.append('firstname', saveData.firstname);
      formData.append('lastname', saveData.lastname);
      formData.append('address', saveData.address);
      formData.append('name', saveData.name);
      formData.append('description', saveData.description);
      formData.append('bank_account_number', saveData.bank_account_number);
      formData.append('ifsc_code', saveData.ifsc_code);
      formData.append('bank_name', saveData.bank_name);
      //formData.append('request_message', saveData.request_message);
      formData.append('bank_proof_document', this.signup_images['bank_proof_document']);
      formData.append('logo', this.signup_images['logo']);
      formData.append('hospital_id',  this.hospital_id);
      

        this.hospitalService.hospitalProfileUpdate(formData).pipe(first()).subscribe(res => {
          if(res['status'])
            {
             console.log(res);
             confirm(res['message']);
            }
          else{
             confirm(res['message']);
          } 
          this.spinner.hide();
         });
      }
      else
      {
        this.otpMsz = 'all values are mandatory';
        this.spinner.hide();
      }
      
    }

}



  


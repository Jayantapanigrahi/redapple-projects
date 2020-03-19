
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
  selector: 'vex-employee-life-certificate',
  templateUrl: './employee-life-certificate.component.html',
  styleUrls: ['./employee-life-certificate.component.scss']
})
export class EmployeeLifeCertificateComponent implements OnInit {
  today:Date;
  lifeCertificateForm: FormGroup;
  life_certificate:any;
  imagePath:any;
  testImagesource:any;
  isSubmitted:boolean=false;
  pdfSrc:any;
  imageTypeErr:boolean = false;
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
  	this.getLifeCertificate();
  	this.lifeCertificateForm = this.fb.group({
		       life_certificate:['',Validators.required],
		       certificate_number:['', Validators.required],
		       start_date:['', Validators.required],
		       end_date:['', Validators.required],
		       });
   }

  importFile(event) {
    if (event.target.files.length == 0) {
       console.log("No file selected!");
       return
    }
    let file = event.target.files[0];
    if(file.type != 'application/pdf'){
       	this.imageTypeErr = true;
       }
      else{
      this.life_certificate=event.target.files[0]
      this.imageTypeErr = false;
      var reader = new FileReader();
      this.imagePath = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); 
      reader.onload = (_event) => { 
      this.pdfSrc = reader.result; 
      }  
     }
    }
  getLifeCertificate(){
  	 this.employeeService.getLifeCertificate().pipe(first()).subscribe(res => {
           if(res['status'] == '1'){
           	 this.lifeCertificateForm.get('certificate_number').setValue(res['result'].certificate_number);
             this.lifeCertificateForm.get('start_date').setValue(res['result'].start_date);
             this.lifeCertificateForm.get('end_date').setValue(res['result'].end_date);
             this.pdfSrc = res['result'].certificate_name;
           }
  	 });
  }
  lifeCertificateFormSubmit(){
     this.isSubmitted = true;
      if(this.lifeCertificateForm.valid && !this.imageTypeErr)
      {
      this.spinner.show();
      let saveData = this.lifeCertificateForm.value;
      const formData = new FormData();
      formData.append('certificate_number', saveData.certificate_number);
      formData.append('start_date', this.datePipe.transform(saveData.start_date,"MM-dd-yyyy"));
      formData.append('end_date', this.datePipe.transform(saveData.end_date,"MM-dd-yyyy"));
      formData.append('life_certificate',  this.life_certificate);
      console.log(formData);
        this.employeeService.updateLifeCertificate(formData).pipe(first()).subscribe(res => {
          if(res['status'] == '1')
            {
             console.log(res);
             confirm(res['message']);
            }
          else{
             confirm(res['Something went wrong']);
          } 
          
         });
        this.spinner.hide();
      }
      else
      {
        this.spinner.hide();
      }
      
    }
  
}

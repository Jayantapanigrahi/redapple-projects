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

import { HomePageService } from './../../_services';

import { HospitalService } from '../../_services';


@Component({
  selector: 'vex-hospital-approved-estimations',
  templateUrl: './hospital-approved-estimations.component.html',
  styleUrls: ['./hospital-approved-estimations.component.scss']
})
export class HospitalApprovedEstimationsComponent implements OnInit {
  estimations:any;
  hospital_id:string;
  user_role:any
  config: any;
  constructor(private hospitalService:HospitalService,public authService: AuthService,private router:Router,private datePipe:DatePipe, private spinner: NgxSpinnerService,private fb: FormBuilder, private homePageService:HomePageService) { 
   this.user_role = this.authService.loggedUserScope;
   }
   
  ngOnInit() {
  	this.loadAdminDetails();
    
  }

  loadEstimations(){
    let condObj = {hospital_id:this.hospital_id,collection:'all',list_type:'approved'}
    
  	this.hospitalService.loadEstimations(condObj).pipe(first()).subscribe(request => {
      if(request['status'])
        {
           console.log(request);
          this.estimations = request['result']
          this.config = {
          itemsPerPage: 10,
          currentPage: 1,
          totalItems: this.estimations.count
          };
        }
      else{
         this.estimations = [];
      } 
     });
  }

  loadAdminDetails(){
    this.hospitalService.loadAdminDetails({}).subscribe(request => {
      console.log(request['result']);
      if(request['status'])
        {
          this.hospital_id = request['result'].user_hospital.id
          this.loadEstimations();
        }
      else{
         this.hospital_id = '0';
      } 
     });
  }

  pageChanged(event){
    this.config.currentPage = event;
  }

}

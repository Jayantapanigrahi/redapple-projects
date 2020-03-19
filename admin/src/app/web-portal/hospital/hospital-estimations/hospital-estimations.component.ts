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
  selector: 'vex-hospital-estimations',
  templateUrl: './hospital-estimations.component.html',
  styleUrls: ['./hospital-estimations.component.scss']
})
export class HospitalEstimationsComponent implements OnInit {
  panelOpenState = false;
  estimations:any;
  hospital_id:string;
  user_role:any;
  config: any;
  estimationsUnFilter:any;
  listView:boolean=true;
  detailsView:boolean=false;
  listElement:any;
  constructor(private hospitalService:HospitalService,public authService: AuthService,private router:Router,private datePipe:DatePipe, private spinner: NgxSpinnerService,private fb: FormBuilder, private homePageService:HomePageService) { 
   this.user_role = this.authService.loggedUserScope;
   }
   
  ngOnInit() {
  	this.loadAdminDetails();
  }
   viewDetails(elementEst) {
    this.listView = false;
    this.detailsView = true;
    this.listElement = elementEst;
  }
   viewList() {
     this.listView = true;
    this.detailsView = false;
  }
   
   applyFilter(value: string) {
    if(value != ''){
    var estimationsFilter=[];
    let filter = value.toLowerCase();
    for ( let i = 0 ; i < this.estimations.length; i ++ ) {
        let option = this.estimations[i];
        if ( (option.employee.employee_name.toLowerCase().indexOf(filter) >= 0) || (option.date_of_admission.toLowerCase().indexOf(filter) >= 0) || (option.admission_number.toLowerCase().indexOf(filter) >= 0)) {
          estimationsFilter.push( option );
        }
      }
    }
    else
    {
     estimationsFilter = this.estimationsUnFilter;
    }
    this.estimations = estimationsFilter
   // this.estimations.filter = filterValue.trim().toLowerCase();
  }
  loadEstimations(){
    let condObj = {hospital_id:this.hospital_id,collection:'all'}
    if(this.user_role == 'data_entry'){
      condObj.collection = 'partial'
    }
  	this.hospitalService.loadEstimations(condObj).pipe(first()).subscribe(request => {
      if(request['status'])
        {
           console.log(request);
          this.estimationsUnFilter = request['result'];
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

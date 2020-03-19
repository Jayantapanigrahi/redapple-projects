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
import { DomSanitizer } from '@angular/platform-browser';


import {FormControl, FormGroup, FormsModule, FormBuilder, FormArray, Validators} from '@angular/forms';

import { HomePageService } from './../../_services';
import { EmployeeService } from './../../_services';


@Component({
  selector: 'vex-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {
  employeeDetails:any;
  pendingEstimations:any;
  pendEstconfig:any;
  approvedEstimations:any;
  appEstconfig:any;
  approvedBills:any;
  appBillconfig:any;
  pendingBills:any;
  pendingBillconfig:any;
  fileUrl;
  constructor(private sanitizer: DomSanitizer,public employeeService: EmployeeService,public authService: AuthService,private router:Router,private datePipe:DatePipe, private spinner: NgxSpinnerService,private fb: FormBuilder, private homePageService:HomePageService) { 
   }
   
  ngOnInit() {
  	this.loadUserDetails();
    this.loadPendingEstimations();
    this.loadApprovedEstimations();
    this.loadApprovedBills();
    this.loadPendingBills();
    this.getLifeCertificate();
  }
  

  getLifeCertificate(){
     this.employeeService.getLifeCertificate().pipe(first()).subscribe(res => {
           if(res['status'] == '1'){
             this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res['result'].certificate_name);
           }
     });
  }


  loadUserDetails(){
  	this.employeeService.loadUserDetails({}).pipe(first()).subscribe(request => {
      if(request['status'])
        {
          this.employeeDetails = request['result']
        }
      else{
         this.employeeDetails = [];
      } 
     });
  }

  loadPendingEstimations(){
    this.employeeService.loadEstimations({type:'Pending'}).pipe(first()).subscribe(request => {
      if(request['status'])
        {
          console.log(request);
          this.pendingEstimations = request['result']
          this.pendEstconfig = {
          itemsPerPage: 1,
          currentPage: 1,
          //id:'pendingEstmt',
          totalItems: this.pendingEstimations.count
          };
        }
      else{
         this.pendingEstimations = [];
      } 
     });
  }

  pagePendEstChanged(event){
    this.pendEstconfig.currentPage = event;
  }
  loadApprovedEstimations(){
    this.employeeService.loadEstimations({type:'Approved'}).pipe(first()).subscribe(request => {
      if(request['status'])
        {
          console.log(request);
          this.approvedEstimations = request['result']
          this.appEstconfig = {
          itemsPerPage: 1,
          currentPage: 1,
          //id:'apprvdEstmt',
          totalItems: this.approvedEstimations.count
          };
        }
      else{
         this.approvedEstimations = [];
      } 
     });
  }
  pageApEstChanged(event){
    this.appEstconfig.currentPage = event;
  }

  loadApprovedBills(){
    this.employeeService.getBill({list_type:'Approved'}).pipe(first()).subscribe(request => {
      if(request['status'])
        {
          console.log(request);
          this.approvedBills = request['result']
          this.appBillconfig = {
          itemsPerPage: 10,
          currentPage: 1,
          totalItems: this.approvedBills.count
          };
        }
      else{
         this.approvedBills = [];
      } 
     });
  }
  pageApBillChanged(event){
    this.appBillconfig.currentPage = event;
  }


  loadPendingBills(){
    this.employeeService.getBill({list_type:'Pending'}).pipe(first()).subscribe(request => {
      if(request['status'])
        {
          console.log(request);
          this.pendingBills = request['result']
          this.pendingBillconfig = {
          itemsPerPage: 10,
          currentPage: 1,
          totalItems: this.pendingBills.count
          };
        }
      else{
         this.pendingBills = [];
      } 
     });
  }
  pagePdBillChanged(event){
    this.pendingBillconfig.currentPage = event;
  }


}

import { Component, NgModule, OnInit,ViewChild } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { Router }      from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

import { Observable, of } from 'rxjs';
import {first , tap, delay,map } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import {DatePipe} from '@angular/common';
import { AuthService } from '../../auth/auth.service';


import {FormControl, FormGroup, FormsModule, FormBuilder, FormArray, Validators} from '@angular/forms';

import { HospitalService } from '../../_services';

export interface billData {
  total_cost: string;
  company_approval_date: string;
  company_approve_amount: string;
  employee_name:string;
  medical_card_number:string;
}


@Component({
  selector: 'vex-hospital-approved-bills',
  templateUrl: './hospital-approved-bills.component.html',
  styleUrls: ['./hospital-approved-bills.component.scss']
})

export class HospitalApprovedBillsComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  bills:any;
  hospital_id:string
  user_role:any
  config: any;
  startDate:Date
  endDate:Date;
  listView:boolean=true;
  detailsView:boolean=false;
  billDetails:any;
  searchForm = new FormGroup({
    date_from: new FormControl(''),
    date_to: new FormControl(''),
   });
  
  constructor(public hospitalService: HospitalService,public authService: AuthService,private router:Router,private datePipe:DatePipe, private spinner: NgxSpinnerService,private fb: FormBuilder) { 
      this.user_role = this.authService.loggedUserScope;
   }
    displayedColumns: string[] = ['serial_no','bill_amount', 'date_of_clearance', 'cleared_amount','emp_name','reference','medical_card_number'];
    dataSource: MatTableDataSource<billData>;
   
  ngOnInit() {
  	this.loadAdminDetails();
  }

  reset(){
    this.loadAdminDetails();
  }
  loadAdminDetails(){
    this.hospitalService.loadAdminDetails({}).subscribe(request => {
      console.log(request['result']);
      if(request['status'])
        {
          this.hospital_id = request['result'].user_hospital.id
          this.loadBills()
        }
      else{
         this.hospital_id = '0';
      } 
     });
  }
  searchData(){
    if (this.searchForm.valid) { 
    let condObj = {hospital_id:this.hospital_id,collection:'all',list_type:'approved',start_date:this.searchForm.value.date_from,end_date:this.searchForm.value.date_to}
    
    this.hospitalService.getBill(condObj).pipe(first()).subscribe(request => {
      if(request['status'])
        {
          this.dataSource=new MatTableDataSource(request["result"]);
          setTimeout(() => this.dataSource.paginator = this.paginator);
        }
      else{
         this.dataSource = new MatTableDataSource();
      } 
     });
    }
  }

  loadBills(){
    let condObj = {hospital_id:this.hospital_id,collection:'all',list_type:'approved'}
    
  	this.hospitalService.getBill(condObj).pipe(first()).subscribe(request => {
      if(request['status'])
        {
          this.dataSource=new MatTableDataSource(request["result"]);
          setTimeout(() => this.dataSource.paginator = this.paginator);
        }
      else{
         this.dataSource = new MatTableDataSource();
      } 
     });
  }

 reject(id)
  {
  let result = confirm("Are you sure you want Reject the bill? This will be removed permanently !!! ");
  if (result == true) {  
  this.hospitalService.deleteBill({bill_id:id}).pipe(first()).subscribe(resp => {
        this.loadBills();
    });
  }
  }
  approve(id)
  {
  let result = confirm("Are you sure? Bill will be sent for department approval !!! ");
  if (result == true) {  
  this.hospitalService.ApproveBill({bill_id:id, hospital_submit:'yes',hospital_submit_date:this.datePipe.transform(new Date(),"MM-dd-yyyy")}).pipe(first()).subscribe(resp => {
        this.loadBills();
    });
  }
  }

  details(billDeatil:any){
    this.listView = false;
    this.detailsView = true;
    this.billDetails = billDeatil;
  }
  viewList(){
    this.listView = true;
    this.detailsView = false;
  }

}

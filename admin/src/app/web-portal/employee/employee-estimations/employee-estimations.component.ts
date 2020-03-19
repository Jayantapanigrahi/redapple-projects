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
import { EmployeeService } from './../../_services';


@Component({
  selector: 'vex-employee-estimations',
  templateUrl: './employee-estimations.component.html',
  styleUrls: ['./employee-estimations.component.scss']
})
export class EmployeeEstimationsComponent implements OnInit {
  estimations:any;
    config: any;
  constructor(public employeeService: EmployeeService,public authService: AuthService,private router:Router,private datePipe:DatePipe, private spinner: NgxSpinnerService,private fb: FormBuilder, private homePageService:HomePageService) { 
   }
   
  ngOnInit() {
  	this.loadEstimations();
  }

  loadEstimations(){
  	this.employeeService.loadEstimations({}).pipe(first()).subscribe(request => {
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
  pageChanged(event){
    this.config.currentPage = event;
  }

}

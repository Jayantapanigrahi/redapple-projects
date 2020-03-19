import { Component, OnInit } from '@angular/core';
import { HospitalService } from './../../_services';
import { AuthService } from '../../auth/auth.service';
import {first , tap, delay,map } from 'rxjs/operators';

@Component({
  selector: 'vex-hospital-dashboard',
  templateUrl: './hospital-dashboard.component.html',
  styleUrls: ['./hospital-dashboard.component.scss']
})
export class HospitalDashboardComponent implements OnInit {
 is_logged_in:boolean;
  user_type:any;
   user_name:string;
   user_image:string;
   hospital_id:any;
   estimations:any;
   user_role:any;
   bills:any;
   listView:boolean=true;
   detailaView:boolean=false;
   estimateData:any;
  constructor(public authService: AuthService, public hospitalService: HospitalService,) { 
    this.is_logged_in = this.authService.isLoggedIn;
    this.user_type = this.authService.loggedUserType;
    this.user_name = this.authService.loggedUserName;
    this.user_role = this.authService.loggedUserScope;
   }

  ngOnInit() {
    this.loadAdminDetails();
 }

 loadAdminDetails(){
    this.hospitalService.loadAdminDetails({}).subscribe(request => {
      console.log(request['result']);
      if(request['status'])
        {
          this.hospital_id = request['result'].user_hospital.id
          this.loadEstimations();
          this.loadBills();  
        }
      else{
         this.hospital_id = '0';
      } 
     });
  }

  loadEstimations(){
    let condObj = {hospital_id:this.hospital_id,collection:'all'}
    if(this.user_role == 'data_entry'){
      condObj.collection = 'partial'
    }
    this.hospitalService.loadEstimations(condObj).pipe(first()).subscribe(request => {
      if(request['status'])
        {
         request['result'].map(function(elememt,key) {
           elememt.totalEstAmnt = 0
            elememt.estimations.map(function(Eelememt,key) {
              elememt.totalEstAmnt = elememt.totalEstAmnt+parseInt(Eelememt.total_estimated_amount);
            });
          });
          
          this.estimations = request['result'];
          console.log(this.estimations);
        }
      else{
         this.estimations = [];
      } 
     });
  }

  loadBills(){
    let condObj = {hospital_id:this.hospital_id,collection:'all'}
    if(this.user_role == 'data_entry'){
      condObj.collection = 'partial'
    }
    this.hospitalService.getBill(condObj).pipe(first()).subscribe(request => {
      if(request['status'])
        {
          console.log(request);
          this.bills = request['result']
        }
      else{
         this.bills = [];
      } 
     });
  }

  estimateDetails(estimates:any){
     this.listView = false;
     this.detailaView = true;
     this.estimateData = estimates;
  }

 viewList(){
   this.listView = true;
     this.detailaView = false;
 }

}

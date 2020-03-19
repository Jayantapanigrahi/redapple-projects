import { Component, Input, ViewChild, OnInit, HostListener } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, FormArray, FormsModule, AbstractControl, ValidationErrors} from '@angular/forms';
import {DatePipe} from '@angular/common'

import { HospitalService } from '../../_services';

import {first , tap, delay, map, startWith } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';
import { AlertService } from '../../../_alert';

@Component({
  selector: 'vex-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.scss']
})
export class CommunicationComponent implements OnInit {
  comunication: FormGroup;
  hospital_id:string
  today:Date;
  isSubmitted = 0;
  comunicationList:any;
  listView:boolean=true;
  formView:boolean=false;
  config: any;
 constructor(public alertService:AlertService,private hospitalService:HospitalService, private fb: FormBuilder,private datePipe:DatePipe,) { 
      this.comunication = this.fb.group({
          remarks: ['', Validators.required],
      	});
  this.today = new Date();
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
          this.loadComunication();
        }
      else{
         this.hospital_id = '0';
      } 
     });
    }

loadComunication(){
    this.hospitalService.getComunication({hospital_id:this.hospital_id}).subscribe(request => {
      console.log(request['result']);
      if(request['status'])
        {
          this.comunicationList = request['result'];
          this.config = {
          itemsPerPage: 10,
          currentPage: 1,
          totalItems: this.comunicationList.count
          };
          
        }
      else{
         this.comunicationList = [];
      } 
     });
    }
    
    addNew(){
    	this.listView=false;
    	this.formView=true;
    }

    list(){
      this.listView=true;
      this.formView=false;
    }
    save() {
      this.isSubmitted = 1;
      if(this.comunication.valid)
      {
      	let saveData = this.comunication.value;
      	let saveForm = {
      		        hospital_id:this.hospital_id,
      		        remarks:saveData.remarks,
      		      }
        this.hospitalService.addComunication(saveForm).pipe(first()).subscribe(res => {
          if(res['status'] == '1')
            {
             this.alertService.success(res['message']);
             confirm(res['message']);
              this.listView=true;
    	      this.formView=false;
    	      this.loadComunication();
            }
          else{
             confirm(res['message']);
             this.alertService.error(res['message']);
          } 
         
         });

      }
     }

     pageChanged(event){
    this.config.currentPage = event;
  }
}

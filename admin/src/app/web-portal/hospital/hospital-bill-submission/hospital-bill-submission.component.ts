import { Component, Input, ViewChild, OnInit, HostListener } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, FormArray, FormsModule, AbstractControl, ValidationErrors} from '@angular/forms';
import {DatePipe} from '@angular/common';

import { HospitalService } from '../../_services';

import {first , tap, delay,map } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';
import { AlertService } from '../../../_alert';
import * as moment from 'moment';

@Component({
  selector: 'vex-hospital-bill-submission',
  templateUrl: './hospital-bill-submission.component.html',
  styleUrls: ['./hospital-bill-submission.component.scss']
})
export class HospitalBillSubmissionComponent implements OnInit {
  addBillForm: FormGroup;
  hospital_id:string
  employyeArr=[];
  user_sign_img;
  isSubmitted = 0;
  errorMessage:any;
  invoice_images=[];
  discharge_files;
  employee_pop=[];
  sumEstmt:any=0;
  maxDate = moment(new Date()).format('YYYY-MM-DD');
  

  constructor(public alertService:AlertService,private hospitalService:HospitalService, private fb: FormBuilder,private datePipe:DatePipe,) { 
      this.addBillForm = this.fb.group({
          user_id: ['', Validators.required],
      	  admission_number: ['', Validators.required],
          medical_service_description: ['', Validators.required],
      	  final_diagnosis:new FormControl('',[Validators.required]),
      	  line_of_treatment: ['', Validators.required],
          date_of_discharge:new FormControl('',[Validators.required]),
      	  discharge_summary_document: ['', Validators.required],
      	  total_cost: ['', Validators.required],
      	  amountEstimation: this.fb.array([
	      	this.fb.group({
		      invoice_number: ['', Validators.required],
          document_description: ['', Validators.required],
		      document: ['', Validators.required],
		      amount: ['', Validators.required],
                  })
	      	]),
	    });
  }
 
  
  get particulars(): FormArray {
    return this.addBillForm.get('amountEstimation') as FormArray;
  }

  ngOnInit() {
  	 this.loadAdminDetails();
  	 
  }
  onKeyUser(value:string){
    if(value != ''){
    this.employee_pop=[];
    let filter = value.toLowerCase();
    for ( let i = 0 ; i < this.employyeArr.length; i ++ ) {
        let option = this.employyeArr[i];
        if ( (option.employee_name.toLowerCase().indexOf(filter) >= 0)) {
          this.employee_pop.push( option );
        }
      }
    }
    else
    {
      this.employee_pop=[];
    }
  }

  getAdmissiondetails(user_id:number){
    let condObj = {hospital_id:this.hospital_id,collection:'all',user_id:user_id};
    this.hospitalService.getAdmissiondetails(condObj).pipe(first()).subscribe(request => {
       this.addBillForm.get('admission_number').setValue(request['result'].admission_number);
       this.addBillForm.get('line_of_treatment').setValue(request['result'].estimations[0].plan_of_treatment);
       this.addBillForm.get('date_of_discharge').setValue(new Date());
       for ( let i = 0 ; i < request['result'].estimations.length; i ++ ) {
       this.sumEstmt = this.sumEstmt+request['result'].estimations[i].total_estimated_amount;
        }
       console.log(request);
    });
  }

  loadAdminDetails(){
    this.hospitalService.loadAdminDetails({}).subscribe(request => {
      console.log(request['result']);
      if(request['status'])
        {
          this.hospital_id = request['result'].user_hospital.id;
          this.loadEmployees();
        }
      else{
         this.hospital_id = '0';
      } 
     });
  }
  loadEmployees(){
    let condObj = {hospital_id:this.hospital_id,collection:'all'}
    this.hospitalService.loadEstimations(condObj).pipe(first()).subscribe(request => {
       for ( let i = 0 ; i < request["result"].length; i ++ ) {
          this.employyeArr.push(request["result"][i].employee);
       }
       console.log(this.employyeArr);
    });
  }

  omit_text(event) {
      var key;
      key = event.charCode;  //         key = event.keyCode;  (Both can be used)
      return ((key >= 48 && key <= 57) || key == 46);
    }

  getSum() {
    let sum = this.particulars.value.reduce((prev, next) => prev + +next.amount, 0);
    this.addBillForm.get('total_cost').setValue(sum);
    }
  addCreds() {
    this.particulars.push(this.fb.group({
		      invoice_number: ['', Validators.required],
          document_description: ['', Validators.required],
          document: ['', Validators.required],
          amount: ['', Validators.required],
    }));
  }

  deleteInvoice(index) {
    this.particulars.removeAt(index);
    this.invoice_images.splice(index, 1);
  }

  importFile(event,index) {
      this.invoice_images[index]=event.target.files[0]
      console.log(this.invoice_images);
    }
 importFileDischarge(event) {
      this.discharge_files=event.target.files[0]
      console.log(this.discharge_files);
    }

  save() {
      this.isSubmitted = 1;
      console.log(this.addBillForm.value);
      if(this.addBillForm.valid)
      {
      let saveData = this.addBillForm.value;
      const formData = new FormData();
      formData.append('user_id', saveData.user_id);
      formData.append('admission_number', saveData.admission_number);
      formData.append('medical_service_description', saveData.medical_service_description);
      formData.append('final_diagnosis', saveData.final_diagnosis);
      formData.append('line_of_treatment',saveData.line_of_treatment);
      formData.append('date_of_discharge',this.datePipe.transform(saveData.date_of_discharge,"MM-dd-yyyy"));;
      formData.append('hospital_id', this.hospital_id);
      formData.append('total_cost', saveData.total_cost);
      formData.append('bill_document',JSON.stringify(saveData.amountEstimation));
      formData.append('discharge_files', this.discharge_files);
      this.invoice_images.forEach(function(element) {
      formData.append("invoice_images",element);
      });
      console.log(formData);
        this.hospitalService.addBill(formData).pipe(first()).subscribe(res => {
          if(res['status'] == '1')
            {
             this.alertService.success(res['message']);
             confirm(res['message']);
             location.href = 'hospital/hospital-bill-list';
            }
          else{
             confirm(res['message']);
             this.alertService.error(res['message']);
          } 
         
         });
      }
      else
      {
         this.alertService.error('Please fill the required fields');
      }
     
  }


}

import { Component, Input, ViewChild, OnInit, HostListener } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, FormArray, FormsModule, AbstractControl, ValidationErrors} from '@angular/forms';
import {DatePipe} from '@angular/common';
import { Router }      from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { HomePageService,EmployeeService,OpdService } from './../../_services';

import { NgxSpinnerService } from "ngx-spinner";

import {first , tap, delay,map } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';
import { AlertService } from '../../../_alert';
import * as moment from 'moment';
@Component({
  selector: 'vex-employee-opd-claim',
  templateUrl: './employee-opd-claim.component.html',
  styleUrls: ['./employee-opd-claim.component.scss']
})
export class EmployeeOpdClaimComponent implements OnInit {
	//@ViewChild('sigPad', {static: true}) sigPad;
	  // sigPadElement;
	  // context;
	  // isDrawing = false;
	  // user_sign;
	  opdClaimForm: FormGroup;
	  user_sign_img;
	  user_id:any;
	  isSubmitted:Boolean=false;
	  errorMessage:any;
	  secASum = 0;
	  secBSum = 0;
	  secCSum = 0;
	  grandTotal = 0;
    employee:any;
    consultation_file=[];
    injection_file=[];
    medicine_file=[];
    pathology_file=[];
    consultatTab:boolean=false;
    injectionTab:boolean=false;
    pathoTab:boolean=false;
    medicineTab:boolean=false;
    somevalue:boolean=false;
    maxDate = moment(new Date()).format('YYYY-MM-DD');
    //minDate=this.accommodation_date_from;
    //maxDate ="2018-09-08"
    minDate='null';
    //date1='null';
  constructor(public alertService:AlertService,
              private router:Router,
              private datePipe:DatePipe,
              private spinner: NgxSpinnerService,
              private fb: FormBuilder,
              private homePageService:HomePageService,
              public employeeService:EmployeeService,
              public opdService:OpdService,
              private snackbar: MatSnackBar,) {
  	this.opdClaimForm = this.fb.group({
      	  eis_no: [{value:'',disabled:true}, Validators.required],
      	  medical_card_reg_no:[{value:'',disabled:true},Validators.required],
      	  amount_claimed:['',[Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      	  bank_name_branch:[{value:'',disabled:true},Validators.required],
      	  cheque_mailing_address:[{value:'',disabled:true},Validators.required],
      	  total_consultation_amount: ['0', Validators.required],
      	  total_injection_amount: ['0', Validators.required],
      	  total_medicine_amount: ['0', Validators.required],
      	  total_patho_amount: ['0', Validators.required],
      	  surgery_amount: [''],
      	  medicine_sec_amount: [''],
      	  total_sum_a: ['0'],
      	  total_sum_c: ['0',],
      	  grand_total: ['0',],
      	  accommodation_rate:['',],
      	  accommodation_amount:['0'],
      	  accommodation_date_to:[''],
      	  accommodation_date_from:[''],
      	  consultationArr: this.fb.array([
	      	// this.fb.group({
		      // consultation_date: ['' ],
		      // consultation_amount: [''],
		      // invoice: [''],
        //           })
	      	]),
      	 injectionArr: this.fb.array([
	      	// this.fb.group({
		      // injection_date: [''],
		      // injection_amount: [''],
		      // invoice: [''],
        //           })
	      	]),
      	 medicineArr: this.fb.array([
	      	// this.fb.group({
		      // medicine_date: [''],
		      // medicine_amount: [''],
		      // invoice: [''],
        //           })
	      	]),
      	 pathoArr: this.fb.array([
	      	// this.fb.group({
		      // patho_name: [''],
		      // patho_amount: [''],
		      // invoice: [''],
        //           })
	      	]),
	    });
  }

  ngOnInit() {
  	 // this.sigPadElement = this.sigPad.nativeElement;
    //  this.context = this.sigPadElement.getContext('2d');
    //  this.context.strokeStyle = '#3742fa';
     this.getEmployeeDetails();

  }
  getEmployeeDetails(){
    this.employeeService.loadUserDetails({}).pipe(first()).subscribe(request => {
      if(request['status'])
        {
          this.employee = request['result'];
          console.log(request['result']);
        this.opdClaimForm.get('eis_no').setValue(request['result'].master.eis_number);
        this.opdClaimForm.get('medical_card_reg_no').setValue(request['result'].master.medical_card_number);
        this.opdClaimForm.get('bank_name_branch').setValue(request['result'].master.bank_account_number);
        this.opdClaimForm.get('cheque_mailing_address').setValue(request['result'].employee.present_address);
        }
      else{
         this.employee = {};
      }
     });
  }
  get consultation(): FormArray {
    return this.opdClaimForm.get('consultationArr') as FormArray;
  }
  get injection(): FormArray {
    return this.opdClaimForm.get('injectionArr') as FormArray;
  }
  get medicine(): FormArray {
    return this.opdClaimForm.get('medicineArr') as FormArray;
  }
  get patho(): FormArray {
    return this.opdClaimForm.get('pathoArr') as FormArray;
  }
  getConsultationSum() {
    let sum = this.consultation.value.reduce((prev, next) => prev + +next.consultation_amount, 0);
    this.opdClaimForm.get('total_consultation_amount').setValue(sum);
    this.sumA();
    }
 getMedicineSum() {
    let sum = this.medicine.value.reduce((prev, next) => prev + +next.medicine_amount, 0);
    this.opdClaimForm.get('total_medicine_amount').setValue(sum);
    this.sumA();
    }

   getInjectionSum() {
    let sum = this.injection.value.reduce((prev, next) => prev + +next.injection_amount, 0);
    this.opdClaimForm.get('total_injection_amount').setValue(sum);
    this.sumA();
    }
  getPathoSum() {
    let sum = this.patho.value.reduce((prev, next) => prev + +next.patho_amount, 0);
    this.opdClaimForm.get('total_patho_amount').setValue(sum);
    this.secBSum = sum;
    this.totalSum();
    }
  deleteConsultation(index) {
    this.consultation.removeAt(index);
    if(index == 0){
      this.consultatTab=false;
    }
  }
  deleteInjection(index) {
    this.injection.removeAt(index);
    if(index == 0){
      this.injectionTab=false;
    }
  }
  deleteMedicine(index) {
    this.medicine.removeAt(index);
    if(index == 0){
      this.medicineTab=false;
    }
  }
  deletePatho(index) {
    this.patho.removeAt(index);
    if(index == 0){
      this.pathoTab=false;
    }
  }
  
  addConsultation() {
    this.consultatTab=true;
    this.consultation.push(this.fb.group({
		      consultation_date: ['',Validators.required],
		      consultation_amount: ['',Validators.required],
		      invoice: [''],
    }));
  }
	addMedicine() {
     this.medicineTab=true;
	    this.medicine.push(this.fb.group({
			      medicine_date: ['',Validators.required],
			      medicine_amount: ['',Validators.required],
			      invoice: [''],
	    }));
	  }

  addInjection() {
     this.injectionTab=true;
    this.injection.push(this.fb.group({
		      injection_date: ['',Validators.required],
		      injection_amount: ['',Validators.required],
		      invoice: [''],
    }));
  }
  addPatho() {
    this.pathoTab=true;
    this.patho.push(this.fb.group({
		      patho_name: ['',Validators.required],
		      patho_amount: ['',Validators.required],
		      invoice: [''],
    }));
  }

  sumA(){
  	var sumVal = this.opdClaimForm.value;
  	this.secASum = parseFloat(sumVal.total_consultation_amount)+parseFloat(sumVal.total_injection_amount)+parseFloat(sumVal.total_medicine_amount)
    this.totalSum();
  }

  getSumAccomodation(){
  	var formVal = this.opdClaimForm.value;
  	if(formVal.accommodation_date_to != '' && formVal.accommodation_date_from != '' && formVal.accommodation_rate != '')
  	{
  	   const ONE_DAY = 1000 * 60 * 60 * 24;
       let days =  Math.round(Math.abs(formVal.accommodation_date_to - formVal.accommodation_date_from)/ ONE_DAY);
       console.log(days);
       this.opdClaimForm.get('accommodation_amount').setValue(days*formVal.accommodation_rate);
  	}
    this.sumC();
  }

  sumC(){
  	var sumVal = this.opdClaimForm.value;
  	this.secCSum = parseFloat((!sumVal.accommodation_amount)?0:sumVal.accommodation_amount)+parseFloat((!sumVal.surgery_amount)?0:sumVal.surgery_amount)+parseFloat((!sumVal.medicine_sec_amount)?0:sumVal.medicine_sec_amount)
    this.totalSum();
  }

  totalSum(){
       this.grandTotal = this.secASum+this.secBSum+this.secCSum
  }
  importConsultationFile(event,index) {
    this.consultation_file[index]=event.target.files[0]
    console.log(this.consultation_file);
  }
  importInjectionFile(event,index) {
    //this.injection_file=event.target.files[0]
    this.injection_file[index]=event.target.files[0]
    console.log(this.injection_file);
  }
  importMedicineFile(event,index) {
    //this.medicine_file=event.target.files[0]
    this.medicine_file[index]=event.target.files[0]
    console.log(this.medicine_file);
  }
  importPathologyFile(event,index) {
    //this.pathology_file=event.target.files[0]
    this.pathology_file[index]=event.target.files[0]
    console.log(this.pathology_file);
  }
   omit_text(event) {
      var key;
      key = event.charCode;  //         key = event.keyCode;  (Both can be used)
      return ((key >= 48 && key <= 57) || key == 46);
    }
//   @HostListener('document:mouseup', ['$event'])
//   onMouseUp(e) {
//     this.isDrawing = false;
//   }

//   onMouseDown(e) {
//     this.isDrawing = true;
//     const coords = this.relativeCoords(e);
//     this.context.moveTo(coords.x, coords.y);
//   }

//   onMouseMove(e) {
//     if (this.isDrawing) {
//       const coords = this.relativeCoords(e);
//       this.context.lineTo(coords.x, coords.y);
//       this.context.stroke();
//     }
//   }

//   private relativeCoords(event) {
//     const bounds = event.target.getBoundingClientRect();
//     const x = event.clientX - bounds.left;
//     const y = event.clientY - bounds.top;
//     return { x: x, y: y };
//   }

//   clear() {
//     this.context.clearRect(0, 0, this.sigPadElement.width, this.sigPadElement.height);
//     this.context.beginPath();
//   }

//   saveSign() {
//     this.user_sign = this.sigPadElement.toDataURL('image/jpeg');;
//     this.user_sign_img = this.dataURItoBlob(this.user_sign);
//     console.log(this.user_sign_img);
//   }




//   dataURItoBlob(dataURI) {
//     // convert base64/URLEncoded data component to raw binary data held in a string
//     var byteString;
//     if (dataURI.split(',')[0].indexOf('base64') >= 0)
//         byteString = atob(dataURI.split(',')[1]);
//     else
//         byteString = unescape(dataURI.split(',')[1]);

//     // separate out the mime component
//     var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

//     // write the bytes of the string to a typed array
//     var ia = new Uint8Array(byteString.length);
//     for (var i = 0; i < byteString.length; i++) {
//         ia[i] = byteString.charCodeAt(i);
//     }

//     return new Blob([ia], {type:mimeString});
// }

save(){
      console.log(this.opdClaimForm.value);
      if(this.opdClaimForm.valid)
      {
        if(this.grandTotal > 0)
         {
        this.snackbar.dismiss();
        this.isSubmitted = true;
        let saveData = this.opdClaimForm.value;
        const formData = new FormData();
        //formData.append('user_id', '123');
        //formData.append('user_id', saveData.user_id);
        formData.append('accomodationAmount', saveData.accommodation_amount);
        formData.append('accomodationDateFrom', saveData.accommodation_date_from);
        formData.append('accomodationDateTo',saveData.accommodation_date_to);
        formData.append('accomodationRate',saveData.accommodation_rate);;
        formData.append('amountClaimed', saveData.amount_claimed);
        formData.append('grandTotal', JSON.stringify(this.grandTotal));
        formData.append('medicineAmount',saveData.medicine_sec_amount);
        formData.append('surgeryAmount', saveData.surgery_amount);
        formData.append('totalConsultationAmount', saveData.total_consultation_amount);
        formData.append('totalMedicineAmount', saveData.total_medicine_amount);
        formData.append('totalInjectionAmount', saveData.total_injection_amount);
        formData.append('totalPathoAmount', saveData.total_patho_amount);
        formData.append('consultationArr', JSON.stringify(saveData.consultationArr));
        formData.append('injectionArr', JSON.stringify(saveData.injectionArr));
        formData.append('medicineArr', JSON.stringify(saveData.medicineArr));
        formData.append('pathoArr', JSON.stringify(saveData.pathoArr));
        this.consultation_file.forEach(function(element) {
          formData.append("consultation_file",element);
        });

        this.injection_file.forEach(function(element) {
          formData.append("injection_file",element);
        });
        this.medicine_file.forEach(function(element) {
          formData.append("medicine_file",element);
        });
        this.pathology_file.forEach(function(element) {
          formData.append("pathology_file",element);
        });
        console.log("ok1"+formData);

        this.opdService.addOpd(formData).pipe(first()).subscribe(res => {
          if(res['status'] == '1')
          {
           
            this.alertService.success(res['message']);
            confirm(res['message']);
            location.href = 'employee/opd-claim-list';
          }
          else{
            confirm(res['message']);
            //this.alertService.error('error');
            this.alertService.error(res['message']);
          }

         });
        }
        else{
          this.snackbar.open('Please fill atleast one out of section A,B or C','OK',{
            verticalPosition: 'top',
            horizontalPosition:'right',
            panelClass: ['red-snackbar']
          });
        }
      }
      else{
        this.snackbar.open('Please fill the required fields','OK',{
            verticalPosition: 'top',
            horizontalPosition:'right',
            panelClass: ['red-snackbar']
          });
      }
}
}

import { Component, Input, ViewChild, OnInit, HostListener } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, FormArray, FormsModule, AbstractControl, ValidationErrors} from '@angular/forms';
import {DatePipe} from '@angular/common'
import { ActivatedRoute } from '@angular/router';

import { HospitalService } from '../../_services';

import {first , tap, delay, map, startWith } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';
import { AlertService } from '../../../_alert';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'vex-hospital-estimation-submission',
  templateUrl: './hospital-estimation-submission.component.html',
  styleUrls: ['./hospital-estimation-submission.component.scss']
})
export class HospitalEstimationSubmissionComponent implements OnInit {
  // @ViewChild('sigPad', {static: true}) sigPad;
  // sigPadElement;
  // context;
  // isDrawing = false;
  // user_sign;
  hospitalEstimation: FormGroup;
  hospital_id:string
  hospital_name:string
  employyeArr:any;
  user_sign_img;
  isSubmitted = 0;
  errorMessage:any;
  estimate_files:any;
  employee_pop=[];
  CghsOptions=[];
  cghs_pop=[];
  diag_pop=[];
  showGenAdNum:boolean=false;
  is_admitted:string = 'no';
  today:Date;
  pickerStatus:boolean=false;
  provisionalDiagnosis:any;
  medicalHistory:any;

  constructor(private route: ActivatedRoute,private snackbar: MatSnackBar,public alertService:AlertService,private hospitalService:HospitalService, private fb: FormBuilder,private datePipe:DatePipe,) { 
      this.hospitalEstimation = this.fb.group({
          user_id: ['', Validators.required],
      	  doctor_name: ['', Validators.required],
      	  admission_number: ['', Validators.required],
          date_of_admission:new FormControl('',[Validators.required]),
      	  provisional_diagnosis: ['', Validators.required],
      	  plan_of_treatment: ['', Validators.required],
      	  hospital_disclaimer: ['', Validators.required],
      	  hospital_remarks: ['', Validators.required],
      	  total_estimation_amount: ['', Validators.required],
          estimation_document: ['',Validators.required],
      	  amountEstimation: this.fb.array([
	      	this.fb.group({
		      particulars: ['', Validators.required],
		      cghs_code: ['', Validators.required],
		      amount: ['', Validators.required],
                  })
	      	]),
	    });
      this.today = new Date();
  }
  

  setAdmissionNo(user_id:number){
    console.log(user_id);
    this.hospitalService.getAdmissionNo({hospital_id:this.hospital_id ,user_id:user_id}).subscribe(request => {
      if(request['status'] == '1')
      {
       //this.hospitalEstimation.enable();
       console.log(request['result']);
       this.is_admitted = 'yes';
       this.showGenAdNum = false;
       this.pickerStatus = true;
       this.today = new Date(request['result'].date_of_admission);
       this.hospitalEstimation.get('admission_number').setValue(request['result'].admission_number);
       this.hospitalEstimation.get('date_of_admission').setValue(request['result'].date_of_admission);

      }
      else if(request['status'] == '2')
      {
        this.snackbar.open(request['message'],'OK',{
            verticalPosition: 'top',
            horizontalPosition:'right',
            panelClass: ['red-snackbar'],
            duration:2000
          });
       this.hospitalEstimation.reset();
      }
      else{
        this.showGenAdNum = true;
        this.hospitalEstimation.get('admission_number').setValue('');
        this.hospitalEstimation.get('date_of_admission').setValue('');
      }
     });
    this.hospitalService.getMedicalHistory({user_id:user_id}).subscribe(request => {
      console.log(request);
      if(request['status'] == '1')
      {
         this.medicalHistory = request['result'];
      }
      else{
        this.medicalHistory = {};
      }
      
     });
  }

  get particulars(): FormArray {
    return this.hospitalEstimation.get('amountEstimation') as FormArray;
  }
  generateAdmissionNo(){
    this.pickerStatus = false;
    let admsnNo = this.hospital_name.substring(0, 4).toUpperCase()+Date.now();
    this.hospitalEstimation.get('admission_number').setValue(admsnNo);
    this.hospitalEstimation.get('date_of_admission').setValue(this.today);
  }

  ngOnInit() {
  	 this.loadAdminDetails();
  	 this.loadEmployees();
     this.loadCGHS();
     this.loadDiagnosis();
  	 // this.sigPadElement = this.sigPad.nativeElement;
    //  this.context = this.sigPadElement.getContext('2d');
    //  this.context.strokeStyle = '#3742fa';
  }

  
  loadAdminDetails(){
    this.hospitalService.loadAdminDetails({}).subscribe(request => {
      console.log(request['result']);
      if(request['status'])
        {
          this.hospital_id = request['result'].user_hospital.id
          this.hospital_name = request['result'].user_hospital.name
        }
      else{
         this.hospital_id = '0';
         this.hospital_name = '';
      } 
     });
  }
  setOtherParticular(cghs,rowVal){
    let x = (<FormArray>this.hospitalEstimation.controls['amountEstimation']).at(rowVal);
    console.log(x);
    console.log(cghs)
    x.patchValue({
      cghs_code: this.CghsOptions[cghs].cghs_code,
      particulars: this.CghsOptions[cghs].particulars,
      amount:this.CghsOptions[cghs].amount
    });
    this.getSum();
     // console.log(cghs_code);
     // this.particulars.at(rowVal).patchValue(['1234545', 'Drew','dfdd']);
     // //this.particulars.setValue(['Nancy', 'Drew','dfdd']);
     // console.log(rowVal);
  }
  loadCGHS(){
    this.hospitalService.loadCghssList().subscribe(request => {
      if(request['status'])
        {
          var dummy_cghs = [];
          let id = 0;
          request['result'].cghss.forEach(function(element){
            let cghs = {'id':id,
                        'particulars':element.dispensary_name,
                        'cghs_code': element.code,
                        'amount':element.rate
            }
            id++;
            dummy_cghs[element.code] = cghs;
          })
          this.CghsOptions = dummy_cghs;
           console.log(this.CghsOptions);
         // this.CghsOptions = request['result'].cghss
        }
      else{
         this.CghsOptions = [];
      } 
     });
  }

  loadDiagnosis(){
    this.hospitalService.getAllProvisionalDiagnosiss().subscribe(request => {
      if(request['status'])
        {
          this.provisionalDiagnosis = request['result'].PDs;
        }
         else{
         this.provisionalDiagnosis = [];
      } 
     });
  }
  
  onKeyUser(value:string){
    if(value != ''){
    this.employee_pop=[];
    let filter = value.toLowerCase();
    for ( let i = 0 ; i < this.employyeArr.length; i ++ ) {
        let option = this.employyeArr[i];
        if ( (option.firstname.toLowerCase().indexOf(filter) >= 0) || (option.firstname.toLowerCase().indexOf(filter) >= 0)) {
          this.employee_pop.push( option );
        }
      }
    }
    else
    {
      this.employee_pop=[];
    }
  }

  onKeyCghs(value:string){
    if(value != ''){
    this.cghs_pop=[];
    let filter = value.toLowerCase();
     var dummy_cghs_pop = [];
     this.CghsOptions.forEach(function(element){
       let option = element;
        if ( (option.cghs_code.toLowerCase().indexOf(filter) >= 0)) {
          dummy_cghs_pop.push( option );
        }
        else{
           dummy_cghs_pop.push( option );
        }
     });
     this.cghs_pop = dummy_cghs_pop;
    }
  }


  onKeyDiag(value:string){
    if(value != ''){
    this.diag_pop=[];
    let filter = value.toLowerCase();
     var dummy_diag_pop = [];
     this.provisionalDiagnosis.forEach(function(element){
       let option = element;
        if ( (option.name.toLowerCase().indexOf(filter) >= 0)) {
          dummy_diag_pop.push( option );
        }
     });
     this.diag_pop = dummy_diag_pop;
    }
    else
    {
      this.diag_pop=[];
    }
  }

  importFile(event) {
      this.estimate_files=event.target.files[0]
      console.log(this.estimate_files);
    }
  loadEmployees(){
    this.hospitalService.loadCILEmployees({}).pipe(first()).subscribe(request => {
      this.employyeArr  = request["result"];
      this.route.queryParams.subscribe(params => {
          if(params["uid"]){
            this.employee_pop = this.employyeArr;
            this.hospitalEstimation.get('user_id').setValue(params["uid"]);
            this.setAdmissionNo(params["uid"]);
          }
      });
    });
  }
  getSum() {
  	console.log("working");
    let sum = this.particulars.value.reduce((prev, next) => prev + +next.amount, 0);
    this.hospitalEstimation.get('total_estimation_amount').setValue(sum);
    }
  addCreds() {
    this.particulars.push(this.fb.group({
		      particulars: ['', Validators.required],
		      cghs_code: ['', Validators.required],
		      amount: ['', Validators.required],
    }));
  }
  deleteCreds(index) {
    this.particulars.removeAt(index);
    this.getSum();
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

  save() {
      this.isSubmitted = 1;
      if(this.hospitalEstimation.valid)
      {
      let saveData = this.hospitalEstimation.value;
      const formData = new FormData();
      formData.append('user_id', saveData.user_id);
      formData.append('doctor_name', saveData.doctor_name);
      formData.append('provisional_diagnosis', saveData.provisional_diagnosis);
      formData.append('date_of_admission',this.datePipe.transform(saveData.date_of_admission,"MM-dd-yyyy"));
      formData.append('hospital_id', this.hospital_id);
      formData.append('admission_number', saveData.admission_number);
      formData.append('plan_of_treatment', saveData.plan_of_treatment);
      formData.append('hospital_disclaimer', saveData.hospital_disclaimer);
      formData.append('total_estimated_amount', saveData.total_estimation_amount);
      formData.append('amount_estimation', JSON.stringify(saveData.amountEstimation));
      formData.append('hospital_remarks', saveData.hospital_remarks);
      formData.append('is_admited', this.is_admitted);
      // var file = new File( [this.user_sign_img], 'canvasImage.jpg', { type: 'image/jpeg' } ); 
      formData.append('estimate_files',this.estimate_files);
      console.log(formData);
        this.hospitalService.addEstimation(formData).pipe(first()).subscribe(res => {
          if(res['status'] == '1')
            {
             //this.alertService.success(res['message']);
             confirm(res['message']);
             location.href = 'hospital/hospital-estimation-list';
             
            }
          else{
             confirm(res['message']);
            // this.alertService.error(res['message']);
          } 
         
         });
      }
      else
      {
         this.alertService.error('Please fill the required fields');
      }
     
  }


}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../interfaces/employee.model';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icPerson from '@iconify/icons-ic/twotone-person';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import icMyLocation from '@iconify/icons-ic/twotone-my-location';
import icLocationCity from '@iconify/icons-ic/twotone-location-city';
import icEditLocation from '@iconify/icons-ic/twotone-edit-location';
import { FormControl } from '@angular/forms';
import { map, startWith,first , tap, delay, } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import {DatePipe} from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Employeeservice } from '../../../../app/pages/services/employee.service';
import { AuthService } from '../../../../app/pages/auth/auth.service';
@Component({
  selector: 'vex-employee-create-update',
  templateUrl: './employee-create-update.component.html',
  styleUrls: ['./employee-create-update.component.scss']
})
export class EmployeeCreateUpdateComponent implements OnInit {

  form: FormGroup;
  employeeData:any;
  fileUrl;
  mode: 'create' | 'update' = 'create';

  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  icPerson = icPerson;
  icMyLocation = icMyLocation;
  icLocationCity = icLocationCity;
  icEditLocation = icEditLocation;
  icPhone = icPhone;
  icArrowDropDown = icArrowDropDown;
   is_logged_in:boolean;
   admin_type:any;
   admin_name:string;
   admin_role;
   
  signup_images = [];
  testImagesource={img_executive:'',img_spouse:'',img_nominee:'',sign_executive:'',sign_spouse:'',sign_nominee:''};
  companyList:any;
  imagePath:any;
  profileForm: FormGroup;
  dumy:any;
  afterValid = 0;
  sentotp:any;
  fdVAl:any;
  isSubmitted:Boolean=false;
  today:Date;


  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<EmployeeCreateUpdateComponent>,
              private fb: FormBuilder,
              private employeeservice:Employeeservice,
              private sanitizer: DomSanitizer,
              public authService: AuthService,
              private datePipe:DatePipe,
              private snackbar: MatSnackBar,
              ) {
    this.is_logged_in = this.authService.isAdminLoggedIn;
    this.admin_type = this.authService.loggedAdminType;
    this.admin_name = this.authService.loggedAdminName;
    this.admin_role = this.authService.loggedAdminScope;
    this.today = new Date();
  }

  ngOnInit() {
    this.loadCompany();
     if (this.defaults) {
      console.log(this.defaults);
      this.mode = 'update';
      this.employeeData = this.defaults;
      this.employeeservice.getEmployeesbyID({emp_id:this.employeeData.id}).pipe(first()).subscribe(request => {
      if(request['status'])
        {
          this.fdVAl = request['result']
          console.log(this.fdVAl);
           this.form.get('medical_card_number').setValue((!this.fdVAl.master)?'':this.fdVAl.master.medical_card_number);
           this.form.get('eis_number').setValue((!this.fdVAl.master)?'':this.fdVAl.master.eis_number),
           this.form.get('bank_account_number').setValue((!this.fdVAl.master)?'':this.fdVAl.master.bank_account_number),
           this.form.get('ifsc_code').setValue((!this.fdVAl.master)?'':this.fdVAl.master.ifsc_code),
           this.form.get('pan_number').setValue((!this.fdVAl.master)?'':this.fdVAl.master.pan_number),
           this.form.get('adhaar_number').setValue((!this.fdVAl.master)?'':this.fdVAl.master.adhaar_number),
           this.form.get('life_certificate_id').setValue((!this.fdVAl.master)?'':this.fdVAl.master.life_certificate_id),
           this.form.get('firstname').setValue(this.fdVAl.firstname),
           this.form.get('lastname').setValue(this.fdVAl.lastname),
           this.form.get('spouse_name').setValue(this.fdVAl.employee.spouse_name || ''),
           this.form.get('employee_id').setValue(this.fdVAl.employee.employee_id || ''),
           this.form.get('company_id').setValue(this.fdVAl.employee.company_id || ''),
           this.form.get('date_of_joining').setValue(this.fdVAl.employee.date_of_joining || ''),
           this.form.get('nominee_relationship').setValue(this.fdVAl.nominee.nominee_relationship || ''),
           this.form.get('nominee_name').setValue(this.fdVAl.nominee.nominee_name || ''),
           this.form.get('nominee_address').setValue(this.fdVAl.nominee.nominee_address || ''),
           this.form.get('permanent_address').setValue(this.fdVAl.employee.permanent_address || ''),
           this.form.get('present_address').setValue(this.fdVAl.employee.permanent_address || ''),
           this.form.get('gender').setValue(this.fdVAl.employee.gender || ''),
           this.form.get('date_of_birth').setValue(this.fdVAl.employee.date_of_birth || ''),
           this.form.get('medical_card_amount').setValue((!this.fdVAl.master)?'':this.fdVAl.master.medical_card_amount),
           this.form.get('bank_name').setValue((!this.fdVAl.master)?'':this.fdVAl.master.bank_name),
           this.form.get('mobile').setValue(this.fdVAl.mobile),
           this.form.get('email').setValue(this.fdVAl.email),
           this.form.get('designation').setValue(this.fdVAl.designation),
           this.form.controls['email'].disable();
           this.form.controls['mobile'].disable();
           this.form.controls['designation'].disable();
           this.form.controls['company_id'].disable();
           this.form.controls['employee_id'].disable();
           

           this.testImagesource.img_executive = this.fdVAl.employee.employee_image;
           this.testImagesource.img_spouse = this.fdVAl.employee.spouse_image;
           this.testImagesource.img_nominee = this.fdVAl.nominee.nominee_image;
           this.testImagesource.sign_executive = this.fdVAl.employee.employee_sign;
           this.testImagesource.sign_nominee = this.fdVAl.nominee.nominee_sign;
           this.testImagesource.sign_spouse = this.fdVAl.employee.spouse_sign;

    
        }
      else{
         this.fdVAl = [];
      } 
     });
    } else {
      this.defaults = {} as Employee;
    }
         this.form  = this.fb.group({
           img_executive: new FormControl(''),
           img_spouse: new FormControl(''),
           img_nominee: new FormControl(''),
           sign_executive: new FormControl(''),
           sign_spouse: new FormControl(''),
           sign_nominee: new FormControl(''),
           medical_card_number:[],
           eis_number:[],
           bank_account_number:[],
           ifsc_code:[],
           bank_name:[],
           pan_number:[],
           adhaar_number:[],
           life_certificate_id:[],
           mobile:['', Validators.required],
           email:['', Validators.required],
           firstname:['', Validators.required],
           lastname:[ '', Validators.required],
           company_id:[ '', Validators.required],
           designation:[ '', Validators.required],
           employee_id:[ '', Validators.required],
           spouse_name:[''],
           date_of_joining:['', Validators.required],
           nominee_relationship:['', Validators.required],
           nominee_name:['', Validators.required],
           nominee_address:[ '', Validators.required],
           permanent_address:[ '', Validators.required],
           present_address:['', Validators.required],
           gender:[ '', Validators.required],
           date_of_birth:[ '', Validators.required],
           medical_card_amount:[],
        });
   }
  
omit_text(event) {
      var key;
      key = event.charCode;  //         key = event.keyCode;  (Both can be used)
      return ((key >= 48 && key <= 57));
    }

loadCompany(){
    this.employeeservice.loadCompany().pipe(first()).subscribe(request => {
      if(request['status'])
        {
          this.companyList = request['result']
        }
      else{
         this.companyList = request['result'];
      } 
     });
  }


importFile(event,index) {
    console.log(index);
    if (event.target.files.length == 0) {
       console.log("No file selected!");
       return
    }

      this.signup_images[index]=event.target.files[0]
      var reader = new FileReader();
      this.imagePath = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); 
      reader.onload = (_event) => { 
      this.testImagesource[index] = reader.result; 
      //console.log(this.testImagesource);
      }  
    }
  save() {
    this.isSubmitted = true
    if(this.form.valid)
    {
    if (this.mode === 'create') {
      this.createEmployee();
    } else if (this.mode === 'update') {
      this.updateEmployee();
    }
   }
   else{
     this.snackbar.open('Fill the mandetory fields', 'Sorry', {
                        duration: 10000
                      });
   }
  }

  createEmployee() {
      let saveData = this.form.value;
      console.log(saveData)
      const formData = new FormData();
      formData.append('email', saveData.email);
      formData.append('mobile', saveData.mobile);
      formData.append('designation', saveData.designation);
      formData.append('employee_id', saveData.employee_id);
      formData.append('company_id', saveData.company_id);
      formData.append('firstname', saveData.firstname);
      formData.append('lastname', saveData.lastname);
      formData.append('medical_card_number', saveData.medical_card_number);
      formData.append('eis_number', saveData.eis_number);
      formData.append('bank_account_number', saveData.bank_account_number);
      formData.append('ifsc_code', saveData.ifsc_code);
      formData.append('bank_name', saveData.bank_name);
      formData.append('pan_number', saveData.pan_number);
      formData.append('adhaar_number', saveData.adhaar_number);
      formData.append('life_certificate_id', saveData.life_certificate_id);
      formData.append('spouse_name', saveData.spouse_name);
      formData.append('date_of_joining', this.datePipe.transform(saveData.date_of_joining,"MM-dd-yyyy"));
      formData.append('nominee_relationship', saveData.nominee_relationship);
      formData.append('nominee_name', saveData.nominee_name);
      formData.append('nominee_address', saveData.nominee_address);
      formData.append('permanent_address', saveData.permanent_address);
      formData.append('present_address', saveData.present_address);
      formData.append('medical_card_amount', saveData.medical_card_amount);
      formData.append('gender', saveData.gender);
      formData.append('date_of_birth',this.datePipe.transform(saveData.date_of_birth,"MM-dd-yyyy"));
      formData.append('img_executive', this.signup_images['img_executive']);
      formData.append('img_spouse', this.signup_images['img_spouse']);
      formData.append('img_nominee', this.signup_images['img_nominee']);
      formData.append('sign_executive', this.signup_images['sign_executive']);
      formData.append('sign_spouse', this.signup_images['sign_spouse']);
      formData.append('sign_nominee', this.signup_images['sign_nominee']);

      console.log(formData);
        this.employeeservice.addEmployees(formData).pipe(first()).subscribe(res => {
          if(res['status'] == '1')
            {
             this.dialogRef.close(res);  
            }
            else{
              this.snackbar.open(res['message'], 'Sorry', {
                        duration: 10000
                      });
            }
         
         });
   
      }


  updateEmployee() {
   console.log(this.form.value);
      let saveData = this.form.value;
      const formData = new FormData();
      formData.append('firstname', saveData.firstname);
      formData.append('lastname', saveData.lastname);
      formData.append('medical_card_number', saveData.medical_card_number);
      formData.append('eis_number', saveData.eis_number);
      formData.append('bank_account_number', saveData.bank_account_number);
      formData.append('ifsc_code', saveData.ifsc_code);
      formData.append('bank_name', saveData.bank_name);
      formData.append('pan_number', saveData.pan_number);
      formData.append('adhaar_number', saveData.adhaar_number);
      formData.append('life_certificate_id', saveData.life_certificate_id);
      formData.append('spouse_name', saveData.spouse_name);
      formData.append('date_of_joining', this.datePipe.transform(saveData.date_of_joining,"MM-dd-yyyy"));
      formData.append('nominee_relationship', saveData.nominee_relationship);
      formData.append('nominee_name', saveData.nominee_name);
      formData.append('nominee_address', saveData.nominee_address);
      formData.append('permanent_address', saveData.permanent_address);
      formData.append('present_address', saveData.present_address);
      formData.append('medical_card_amount', saveData.medical_card_amount);
      formData.append('gender', saveData.gender);
      formData.append('date_of_birth',this.datePipe.transform(saveData.date_of_birth,"MM-dd-yyyy"));
      formData.append('img_executive', this.signup_images['img_executive']);
      formData.append('img_spouse', this.signup_images['img_spouse']);
      formData.append('img_nominee', this.signup_images['img_nominee']);
      formData.append('sign_executive', this.signup_images['sign_executive']);
      formData.append('sign_spouse', this.signup_images['sign_spouse']);
      formData.append('sign_nominee', this.signup_images['sign_nominee']);
      formData.append('emp_id', this.employeeData.id);
      console.log(formData);
        this.employeeservice.updateEmployee(formData).pipe(first()).subscribe(res => {
          if(res['status'] == '1')
            {
             this.dialogRef.close(res);  
            }
         
         });
      }

  

  approveemployee() {
    const editbill = {id:'',verified_by_admin:'yes',status:'1'};
    
    editbill.id = this.defaults.id;

    this.employeeservice.editEmployees(editbill).subscribe(Employee => {
      console.log(Employee);
      if(Employee){
        this.dialogRef.close(editbill);  
      }
    });    
  }
  rejectemployee() {
    const editbill = {id:'',verified_by_admin:'no',status:'0'};
    
    editbill.id = this.defaults.id;

    this.employeeservice.editEmployees(editbill).subscribe(Employee => {
      console.log(Employee);
      if(Employee){
        this.dialogRef.close(editbill);  
      }
    });    
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}

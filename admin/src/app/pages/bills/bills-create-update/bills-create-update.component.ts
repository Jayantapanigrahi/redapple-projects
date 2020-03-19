import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BILLS } from '../interfaces/bills.model';
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
import { map, startWith } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BILLSService } from '../../../../app/pages/services/bills.service';
import { AuthService } from '../../../../app/pages/auth/auth.service';
@Component({
  selector: 'vex-bills-create-update',
  templateUrl: './bills-create-update.component.html',
  styleUrls: ['./bills-create-update.component.scss']
})
export class BILLSCreateUpdateComponent implements OnInit {

  
  form: FormGroup;
  billData:any;
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

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<BILLSCreateUpdateComponent>,
              private fb: FormBuilder,
              private cghsService:BILLSService,
              private sanitizer: DomSanitizer,
              public authService: AuthService,
              private snackbar: MatSnackBar,
              ) {
    this.is_logged_in = this.authService.isAdminLoggedIn;
    this.admin_type = this.authService.loggedAdminType;
    this.admin_name = this.authService.loggedAdminName;
    this.admin_role = this.authService.loggedAdminScope;
  }

  ngOnInit() {
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.defaults.discharge_summary_document);
    if (this.defaults) {
      console.log(this.defaults);
      this.mode = 'update';
      this.billData = this.defaults;
    } else {
      this.defaults = {} as BILLS;
    }

    this.form = this.fb.group({
      id: this.defaults.id,
      medical_department_comment: [this.defaults.medical_department_comment || '', Validators.required],
    });
  }

  

  save() {
    if (this.mode === 'create') {
      this.createBILLS();
    } else if (this.mode === 'update') {
      this.updateBILLS();
    }
  }

  createBILLS() {
    const bills = this.form.value;
    if (!bills.logo) {
      bills.logo = 'assets/img/avatars/1.jpg';
    }
    this.cghsService.addbills(bills).subscribe(BILLS => {
      //console.log(BILLS);
      if(BILLS){
        this.dialogRef.close(bills);  
      }
    });
    //this.dialogRef.close(bills);
  }

  updateBILLS() {
    const editbill = this.form.value;
    
    editbill.id = this.defaults.id;

    this.cghsService.editbills(editbill).subscribe(BILLS => {
      console.log(BILLS);
      if(BILLS){
        this.dialogRef.close(editbill);  
      }
    });    
  }

  approveBillMedical(action) {
    const editbill = {id:'',medical_department_approval:action};
    editbill.id = this.defaults.id;

    this.cghsService.editbills(editbill).subscribe(BILLS => {
      console.log(BILLS);
      if(BILLS){
        this.dialogRef.close(editbill);  
      }
    });    
  }
 
 omit_text(event) {
      var key;
      key = event.charCode;  //         key = event.keyCode;  (Both can be used)
      return ((key >= 48 && key <= 57) || key == 46);
    }

  approveBillAccount(action,amount) {
    console.log(action);
    console.log(amount);
    var editbill = {};
    if((action == 'Approved' || action == 'Partially') && !amount){
       this.snackbar.open('Please add amount', 'Sorry', {
                        duration: 10000
                      });
      
    }
    else
    {
      editbill = {id:this.defaults.id,company_approve:action,company_approve_amount:amount,company_approval_date:Date.now()};
      this.cghsService.editbills(editbill).subscribe(BILLS => {
      console.log(BILLS);
      if(BILLS){
        this.dialogRef.close(editbill);  
      }
    }); 
    }
    if(action == 'Rejected')
    {
     let editbill = {id:this.defaults.id,company_approve:action};
     this.cghsService.editbills(editbill).subscribe(BILLS => {
      console.log(BILLS);
      if(BILLS){
        this.dialogRef.close(editbill);  
      }
    }); 
    }

       
  }
  
  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}

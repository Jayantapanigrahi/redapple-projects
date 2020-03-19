import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Estimations } from '../interfaces/estimations.model';
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

import { EstimationsService } from '../../../../app/pages/services/estimations.service';
import { AuthService } from '../../../../app/pages/auth/auth.service';
@Component({
  selector: 'vex-estimations-create-update',
  templateUrl: './estimations-create-update.component.html',
  styleUrls: ['./estimations-create-update.component.scss']
})
export class EstimationsCreateUpdateComponent implements OnInit {

  
  form: FormGroup;
  EstimationData:any;
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
              private dialogRef: MatDialogRef<EstimationsCreateUpdateComponent>,
              private fb: FormBuilder,
              private estimationsService:EstimationsService,
              private sanitizer: DomSanitizer,
              public authService: AuthService,
              ) {
    this.is_logged_in = this.authService.isAdminLoggedIn;
    this.admin_type = this.authService.loggedAdminType;
    this.admin_name = this.authService.loggedAdminName;
    this.admin_role = this.authService.loggedAdminScope;
  }

  ngOnInit() {
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.defaults.estimate_files);
    if (this.defaults) {
      console.log(this.defaults);
      this.mode = 'update';
      this.EstimationData = this.defaults;
    } else {
      this.defaults = {} as Estimations;
    }

    this.form = this.fb.group({
      id: this.defaults.id,
      approved_amount: [this.defaults.approved_amount || '', Validators.required],
    });
  }

  

  save() {
    if (this.mode === 'create') {
      this.createEstimations();
    } else if (this.mode === 'update') {
      this.updateEstimations();
    }
  }
  omit_text(event) {
      var key;
      key = event.charCode;  //         key = event.keyCode;  (Both can be used)
      return ((key >= 48 && key <= 57) || key == 46);
    }

  createEstimations() {
    const estimations = this.form.value;
    if (!estimations.logo) {
      estimations.logo = 'assets/img/avatars/1.jpg';
    }
    this.estimationsService.addestimations(estimations).subscribe(Estimations => {
      //console.log(Estimations);
      if(Estimations){
        this.dialogRef.close(estimations);  
      }
    });
    //this.dialogRef.close(estimations);
  }

  updateEstimations() {
    const editestimation = this.form.value;
    console.log( this.defaults.id);
    editestimation.id = this.defaults.id;
     editestimation.medical_department_approval = 'Approved';
     editestimation.account_department_approval = 'Approved';
    this.estimationsService.editestimations(editestimation).subscribe(Estimations => {
      console.log(Estimations);
      if(Estimations){
        this.dialogRef.close(editestimation);  
      }
    });    
  }

  rejectEstimation() {
    const editestimation = {id:'',department_approval:'no'};
    
    editestimation.id = this.defaults.id;

    this.estimationsService.editestimations(editestimation).subscribe(Estimations => {
      console.log(Estimations);
      if(Estimations){
        this.dialogRef.close(editestimation);  
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

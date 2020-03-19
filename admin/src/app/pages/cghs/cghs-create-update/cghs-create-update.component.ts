import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CGHS } from '../interfaces/cghs.model';
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

import { CGHSService } from '../../../../app/pages/services/cghs.service';

@Component({
  selector: 'vex-cghs-create-update',
  templateUrl: './cghs-create-update.component.html',
  styleUrls: ['./cghs-create-update.component.scss']
})
export class CGHSCreateUpdateComponent implements OnInit {

  
  form: FormGroup;
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

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<CGHSCreateUpdateComponent>,
              private fb: FormBuilder,
              private cghsService:CGHSService
              ) {
  }

  ngOnInit() {
    if (this.defaults) {
      console.log(this.defaults);
      this.mode = 'update';
    } else {
      this.defaults = {} as CGHS;
    }

    this.form = this.fb.group({
      id: this.defaults.id,
      code: [this.defaults.code || '', Validators.required],
      dispensary_name: [this.defaults.dispensary_name || '', Validators.required],
      location: [this.defaults.location || '',Validators.required],
      treatment_description: [this.defaults.treatment_description || '',Validators.required],
      rate: [this.defaults.rate || '',Validators.required]
    });
  }

  

  save() {
    if (this.mode === 'create') {
      this.createCGHS();
    } else if (this.mode === 'update') {
      this.updateCGHS();
    }
  }

  createCGHS() {
    const cghs = this.form.value;
    if (!cghs.logo) {
      cghs.logo = 'assets/img/avatars/1.jpg';
    }
    this.cghsService.addCGHS(cghs).subscribe(CGHS => {
      //console.log(CGHS);
      if(CGHS){
        this.dialogRef.close(cghs);  
      }
    });
    //this.dialogRef.close(cghs);
  }

  updateCGHS() {
    const editcghs = this.form.value;
    
    editcghs.id = this.defaults.id;

    this.cghsService.editCGHS(editcghs).subscribe(CGHS => {
      console.log(CGHS);
      if(CGHS){
        this.dialogRef.close(editcghs);  
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

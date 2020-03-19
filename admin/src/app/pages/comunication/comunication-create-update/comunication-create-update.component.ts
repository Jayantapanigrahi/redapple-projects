import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Comunication } from '../interfaces/comunication.model';
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

import { ComunicationService } from '../../../../app/pages/services/comunication.service';
import { CGHSService } from '../../../../app/pages/services/cghs.service';

export interface CountryState {
  name: string;
  population: string;
  flag: string;
}

export interface cghsList {
  id: number;
  code: string;
}

@Component({
  selector: 'vex-comunication-create-update',
  templateUrl: './comunication-create-update.component.html',
  styleUrls: ['./comunication-create-update.component.scss']
})
export class ComunicationCreateUpdateComponent implements OnInit {

  
  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  cghss: any;
  cghsCode:any;
  imgURL:any = null;
  imagePath: File = null;


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
              private dialogRef: MatDialogRef<ComunicationCreateUpdateComponent>,
              private fb: FormBuilder,
              private comunicationService:ComunicationService,
              private cghsService: CGHSService
              ) {
  }

  ngOnInit() {
    this.cghsService.getAllCGHSs().subscribe(cghss => {
      this.cghss = cghss["result"]["cghss"];            
    });
   

    if (this.defaults) {
      console.log(this.defaults);
      this.mode = 'update';
    } else {
      this.defaults = {} as Comunication;
    }

    this.form = this.fb.group({
      id: this.defaults.id,
      remarks: [this.defaults.remarks || '', Validators.required],
      cil_admin_comments: [this.defaults.cil_admin_comments || '', Validators.required],
    });
  }

  logoAddEdit = null;
    // onLogoSelected(event){
    //     console.log(event);
    //     this.logoAddEdit=event.target.files[0]
    //     this.preview();        
    // }

  preview() {
      // Show preview 
      var mimeType = this.logoAddEdit.type;
      if (mimeType.match(/image\/*/) == null) {
        return;
      }
   
      var reader = new FileReader();      
      reader.readAsDataURL(this.logoAddEdit); 
      reader.onload = (_event) => { 
        this.imgURL = reader.result; 
      }
  }

  save() {
    if (this.mode === 'create') {
      this.createComunication();
    } else if (this.mode === 'update') {
      this.updateComunication();
    }
  }

  createComunication() {
    const comunication = this.form.value;
    this.comunicationService.addComunication(comunication).subscribe(Comunication => {
      //console.log(Comunication);
      if(Comunication){
        this.dialogRef.close(comunication);  
      }
    });
    //this.dialogRef.close(comunication);
  }

  updateComunication() {
    const editcomunication = this.form.value;
    this.comunicationService.editComunication(editcomunication).subscribe(Comunication => {    
      console.log(Comunication);
      if(Comunication){
        this.dialogRef.close(editcomunication);  
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

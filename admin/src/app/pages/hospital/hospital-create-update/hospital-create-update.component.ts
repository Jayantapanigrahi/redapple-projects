import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Hospital } from '../interfaces/hospital.model';
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

import { HospitalService } from '../../../../app/pages/services/hospital.service';
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
  selector: 'vex-hospital-create-update',
  templateUrl: './hospital-create-update.component.html',
  styleUrls: ['./hospital-create-update.component.scss']
})
export class HospitalCreateUpdateComponent implements OnInit {

  
  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  cghss: any;
  cghsCode:any;
  imgURL:any = null;
  imagePath: File = null;
  bankimgURL:any;

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
              private dialogRef: MatDialogRef<HospitalCreateUpdateComponent>,
              private fb: FormBuilder,
              private hospitalService:HospitalService,
              private cghsService: CGHSService
              ) {
  }

  ngOnInit() {
    this.cghsService.getAllCGHSs().subscribe(cghss => {
      this.cghss = cghss["result"]["cghss"];            
    });
   

    if (this.defaults) {
      console.log(this.defaults);
      // this.cghsService.getCGHSbyID({cghs_id:this.defaults.cghs_id}).subscribe(cghs => {
      //   //console.log("cghs",cghs);
      //   this.cghsCode = (!cghs["result"])?'':cghs["result"]["id"];        
      // });
      this.mode = 'update';
      this.imgURL = this.defaults.logo
      this.bankimgURL = this.defaults.bank_proof_document;
    } else {
      this.defaults = {} as Hospital;
    }

    this.form = this.fb.group({
      id: this.defaults.id,
      logo: [''],
      name: [this.defaults.name || '', Validators.required],
      address: [this.defaults.address || '', Validators.required],
      description: [this.defaults.description || '', Validators.required],
      //cghs_id: [this.defaults.cghs_id || '', Validators.required]
    });
  }

  logoAddEdit = null;
    onLogoSelected(event){
        console.log(event);
        this.logoAddEdit=event.target.files[0]
        this.preview();        
    }

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
      this.createHospital();
    } else if (this.mode === 'update') {
      this.updateHospital();
    }
  }

  approve(id){
    const editHosp = {id:'',verified_by_admin:'yes',status:'1'};
    
    editHosp.id = id;

    this.hospitalService.editHospEmployees(editHosp).subscribe(Employee => {
      console.log(Employee);
      if(Employee){
        this.dialogRef.close();  
      }
    });    

  }
  reject(id){

     const editHosp = {id:'',verified_by_admin:'no',status:'0'};
    
    editHosp.id = id;

    this.hospitalService.editHospEmployees(editHosp).subscribe(Employee => {
      console.log(Employee);
      if(Employee){
        this.dialogRef.close();  
      }
    });    
    
  }

  createHospital() {
    const hospital = this.form.value;
    if (!hospital.logo) {
      hospital.logo = 'assets/img/avatars/1.jpg';
    }
    this.hospitalService.addHospital(hospital).subscribe(Hospital => {
      //console.log(Hospital);
      if(Hospital){
        this.dialogRef.close(hospital);  
      }
    });
    //this.dialogRef.close(hospital);
  }

  updateHospital() {
    const edithospital = this.form.value;
    console.log(edithospital);

    edithospital.id = this.defaults.id;
    edithospital.logo = this.logoAddEdit.name;
    edithospital.file = this.logoAddEdit;



    this.hospitalService.editHospital(edithospital).subscribe(Hospital => {    
      console.log(Hospital);
      if(Hospital){
        this.dialogRef.close(edithospital);  
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

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolesAndResponsibility } from '../interfaces/rolesandresponsibility.model';
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

import { RolesAndResponsibilityService } from '../../../../app/pages/services/rolesandresponsibility.service';

@Component({
  selector: 'vex-rolesandresponsibility-create-update',
  templateUrl: './rolesandresponsibility-create-update.component.html',
  styleUrls: ['./rolesandresponsibility-create-update.component.scss']
})
export class RolesAndResponsibilityreateUpdateComponent implements OnInit {

  
  form: FormGroup;
  companyList:any;
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
              private dialogRef: MatDialogRef<RolesAndResponsibilityreateUpdateComponent>,
              private fb: FormBuilder,
              private rolesAndResponsibility:RolesAndResponsibilityService
              ) {
    this.loadCompany();
  }

  ngOnInit() {
    if (this.defaults) {
      console.log(this.defaults);
      this.mode = 'update';

    } else {
      this.defaults = {} as RolesAndResponsibility;
    }

    this.form = this.fb.group({
      employee_id: [this.defaults.employee_id || '', Validators.required],
      mobile: [this.defaults.mobile || '', [Validators.compose([
                                                      Validators.maxLength(10),
                                                      Validators.minLength(10),
                                                      Validators.pattern(/^-?(0|[1-9]\d*)?$/),
                                                      Validators.required
                                                    ])]],
      email: [this.defaults.email || '',[Validators.required,Validators.email]],
      firstname: [this.defaults.firstname || '',Validators.required],
      lastname: [this.defaults.lastname || '',Validators.required],
      department: [this.defaults.department || '',Validators.required],
      designation: [this.defaults.designation || '',Validators.required],
      company_id: [this.defaults.company_id || '',Validators.required]
    });
  }

  

  save() {
    if (this.mode === 'create') {
      this.createRolesAndResponsibility();
    } else if (this.mode === 'update') {
      this.updateRolesAndResponsibility();
    }
  }

  createRolesAndResponsibility() {
    const rolesandresponsibility = this.form.value;
    console.log(rolesandresponsibility);
    this.rolesAndResponsibility.addRolesAndResponsibility(rolesandresponsibility).subscribe(RolesAndResponsibility => {
      console.log(RolesAndResponsibility);
      if(RolesAndResponsibility){
        this.dialogRef.close(rolesandresponsibility);  
      }
    });
    //this.dialogRef.close(rolesandresponsibility);
  }

  updateRolesAndResponsibility() {
    const editcghs = this.form.value;
    
    editcghs.id = this.defaults.id;
    editcghs.user_role = this.form.value.designation
    this.rolesAndResponsibility.editRolesAndResponsibility(editcghs).subscribe(RolesAndResponsibility => {
      console.log(RolesAndResponsibility);
      if(RolesAndResponsibility){
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


  loadCompany(){
    this.rolesAndResponsibility.loadCompany().subscribe(request => {
      console.log(request['result']);
      if(request['status'])
        {
          this.companyList = request['result']
        }
      else{
         this.companyList = request['result'];
      } 
     });
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


import { HospitalService } from '../../../_services';

@Component({
  selector: 'vex-de-user-create-update',
  templateUrl: './de-user-create-update.component.html',
  styleUrls: ['./de-user-create-update.component.scss']
})
export class DeUserCreateUpdateComponent implements OnInit {

  form: FormGroup;
  companyList:any;
  mode: 'create' | 'update' = 'create';
  hospital_id:number;


  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<DeUserCreateUpdateComponent>,
              private fb: FormBuilder,
              private hospitalService:HospitalService,
              private snackbar: MatSnackBar,
              ) {
    this.loadCompany();
    this.loadAdminDetails();
  }

  ngOnInit() {
    if (this.defaults) {
      console.log(this.defaults);
      this.mode = 'update';

    } else {
      this.defaults = {} as DeUserCreateUpdateComponent;
    }

    this.form = this.fb.group({
      mobile: [this.defaults.mobile || '', [Validators.compose([
                                                      Validators.maxLength(10),
                                                      Validators.minLength(10),
                                                      Validators.pattern(/^-?(0|[1-9]\d*)?$/),
                                                      Validators.required
                                                    ])]],
      email: [this.defaults.email || '',[Validators.required,Validators.email]],
      firstname: [this.defaults.firstname || '',Validators.required],
      lastname: [this.defaults.lastname || '',Validators.required],
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
    if (!rolesandresponsibility.logo) {
      rolesandresponsibility.hospital_id = this.hospital_id ;
    }
    this.hospitalService.addUser(rolesandresponsibility).subscribe(user => {
      console.log(user);
      if(user['status'] == 1){
        this.snackbar.dismiss();
        this.dialogRef.close(rolesandresponsibility);
      }
      else
      {
         this.snackbar.open(user['message'],'OK',{
            verticalPosition: 'top',
            horizontalPosition:'right'
          });
      }
    });
    //this.dialogRef.close(rolesandresponsibility);
  }

  updateRolesAndResponsibility() {
    const userUpdata = this.form.value;

    userUpdata.id = this.defaults.id;
    console.log(userUpdata);

    this.hospitalService.updateUser(userUpdata).subscribe(userUp => {
      console.log(userUp);
      if(userUp){
        this.dialogRef.close(userUpdata);
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
    this.hospitalService.loadCompany().subscribe(request => {
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
  loadAdminDetails(){
    this.hospitalService.loadAdminDetails({}).subscribe(request => {
      console.log(request['result']);
      if(request['status'])
        {
          this.hospital_id = request['result'].user_hospital.id
        }
      else{
         this.hospital_id = 0;
      }
     });
  }


}

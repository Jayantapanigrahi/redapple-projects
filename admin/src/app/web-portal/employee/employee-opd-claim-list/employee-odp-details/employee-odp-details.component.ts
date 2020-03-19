import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'vex-employee-odp-details',
  templateUrl: './employee-odp-details.component.html',
  styleUrls: ['./employee-odp-details.component.scss']
})
export class EmployeeOdpDetailsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<EmployeeOdpDetailsComponent>,
              private fb: FormBuilder,
              ) {
  	}

  ngOnInit() {
  	console.log(this.defaults);
  }

}

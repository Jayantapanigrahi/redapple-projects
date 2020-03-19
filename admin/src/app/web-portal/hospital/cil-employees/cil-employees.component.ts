import {Component, OnInit, ViewChild,Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


import { Observable, of } from 'rxjs';
import {first , tap, delay,map } from 'rxjs/operators';

import { HospitalService } from '../../_services';

export interface UserData {
  mobile: string;
  email: string;
  firstname: string;
  lastname:string;
}

@Component({
  selector: 'vex-cil-employees',
  templateUrl: './cil-employees.component.html',
  styleUrls: ['./cil-employees.component.scss']
})
export class CilEmployeesComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  listView:boolean=true;
  detailsView:boolean=false;
  empDetails:any;
  hospital_id:string
  constructor(private router: Router,private snackbar: MatSnackBar,private hospitalService:HospitalService,public dialog: MatDialog) { }

  displayedColumns: string[] = ['serial_no','mobile', 'email','medical_card_no','employee_id','name','eis','pan','adhar'];
  dataSource: MatTableDataSource<UserData>;

  ngOnInit() {
    this.loadUser();
    this.loadAdminDetails();
  }
  details(row){
    console.log(row);
    this.empDetails = row;
    this.listView = false;
    this.detailsView = true;
  }
  loadAdminDetails(){
    this.hospitalService.loadAdminDetails({}).subscribe(request => {
      console.log(request['result']);
      if(request['status'])
        {
          this.hospital_id = request['result'].user_hospital.id
        }
      else{
         this.hospital_id = '0';
      } 
     });
  }
  viewList(){
    this.listView = true;
    this.detailsView = false;
  }
  estimate(user_id){
    this.hospitalService.getAdmissionNo({hospital_id:this.hospital_id ,user_id:user_id}).subscribe(request => {
      if(request['status'] == '2')
      {
        this.snackbar.open(request['message'],'OK',{
            verticalPosition: 'top',
            horizontalPosition:'right',
            panelClass: ['red-snackbar'],
            duration:2000
          });
       
      }
      else{
        let params={
                "queryParams": {
                  "uid": user_id
                }
              };
        this.router.navigate(['/hospital/hospital-estimation-submission'],params);
      }
     });
  }
  loadUser(){
  	this.hospitalService.loadCILEmployees({}).pipe(first()).subscribe(request => {
      this.dataSource=new MatTableDataSource(request["result"]);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);    
      console.log(this.dataSource);
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  profile(row:any){
    console.log(row);
    this.router.navigate(['/medprofile/'+row.employee.mst_company.code+'/'+row.master.medical_card_number]);
  }

  
}

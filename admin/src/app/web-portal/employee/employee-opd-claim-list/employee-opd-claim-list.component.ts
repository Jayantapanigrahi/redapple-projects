import {Component, OnInit, ViewChild,Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import {first , tap, delay,map } from 'rxjs/operators';

import { HospitalService,OpdService } from '../../_services';
import { EmployeeOdpDetailsComponent } from './employee-odp-details/employee-odp-details.component';


export interface UserData {
  mobile: string;
  email: string;
  firstname: string;
  lastname:string;
}

@Component({
  selector: 'vex-employee-opd-claim-list',
  templateUrl: './employee-opd-claim-list.component.html',
  styleUrls: ['./employee-opd-claim-list.component.scss']
})
export class EmployeeOpdClaimListComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private hospitalService:HospitalService,private opdService:OpdService,public dialog: MatDialog) { }

  displayedColumns: string[] = ['serial_no','amount_claimed','surgery_amount','cost_of_medicine', 'total_consultation_amount', 'total_medicine_amount','total_injection_amount','accomodation_amount','claimed_on','actions'];
  dataSource: MatTableDataSource<UserData>;

  ngOnInit() {
    this.loadUser();
  }

  loadUser(){
  	this.opdService.loadUser({}).pipe(first()).subscribe(request => {
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

  opdDetails(opddata) {
    console.log(opddata);
    this.dialog.open(EmployeeOdpDetailsComponent, {
      data: opddata
    }).afterClosed().subscribe(updatedUserData => {
      if (updatedUserData) {
        this.loadUser();
      }
    });
  }



  // delete(UserData) {
  // 	console.log(UserData.id);
  //   let result = confirm("Are you sure you want delete the opd claim? This will be removed permanently !!! ");
  //   if (result == true) {
  //     this.opdService.deleteOpd({opd_id:UserData.id}).pipe(first()).subscribe(resp => {
  //       this.loadUser();
  //     });
  //   }

  // }
}

import {Component, OnInit, ViewChild,Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DeUserCreateUpdateComponent } from './de-user-create-update/de-user-create-update.component';


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
  selector: 'vex-de-user',
  templateUrl: './de-user.component.html',
  styleUrls: ['./de-user.component.scss']
})
export class DeUserComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private hospitalService:HospitalService,public dialog: MatDialog) { }

  displayedColumns: string[] = ['serial_no','mobile', 'email', 'firstname','lastname','actions'];
  dataSource: MatTableDataSource<UserData>;

  ngOnInit() {
    this.loadUser();
  }

  loadUser(){
  	this.hospitalService.loadUser({}).pipe(first()).subscribe(request => {
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

  addDeUser() {
    this.dialog.open(DeUserCreateUpdateComponent).afterClosed().subscribe((addUser) => {
      if (addUser) {
        this.loadUser();
      }
    });
  }

  updateDeUser(UserData) {
  	console.log(UserData);
    this.dialog.open(DeUserCreateUpdateComponent, {
      data: UserData
    }).afterClosed().subscribe(updatedUserData => {
      if (updatedUserData) {
        this.loadUser();
      }
    });
  }
  
  delete(UserData) {
  	console.log(UserData);
    
  }
}

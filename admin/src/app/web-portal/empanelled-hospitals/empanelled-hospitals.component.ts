import {Component, OnInit, ViewChild,Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


import { Observable, of } from 'rxjs';
import {first , tap, delay,map } from 'rxjs/operators';

import { HomePageService } from './../_services';




export interface UserData {
  name: string;
  address: string;
  description: string;
  logo: string;
  created_at:string;
}

/** Constants used to fill up our data base. */


@Component({
  selector: 'app-empanelled-hospitals',
  templateUrl: './empanelled-hospitals.component.html',
  styleUrls: ['./empanelled-hospitals.component.scss']
})

export class EmpanelledHospitalsComponent implements OnInit {
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private homePageService:HomePageService,public dialog: MatDialog) {
  }
  
  displayedColumns: string[] = ['serial_no','name', 'address', 'description',];
  dataSource: MatTableDataSource<UserData>;


  ngOnInit() {
    this.homePageService.loadHospitals({}).pipe(first()).subscribe(request => {
      this.dataSource=new MatTableDataSource(request["result"].hospitals);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);    
      console.log(this.dataSource);
    });
  }

  applyFilter(filterValue: string) {
    console.log(filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  descriptionPopUp(des:any){

    const dialogRef = this.dialog.open(DescriptionPopUp, {
      width: '60%',
      data: {description:des},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
        });

  }
}


//////##############Image expander component###################//////////

@Component({
  selector: 'description-pop-up',
  templateUrl: 'descrtiption-pop-up.html',
  styleUrls: ['./empanelled-hospitals.component.scss']
})
export class DescriptionPopUp {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<DescriptionPopUp>,
    )
     {
     }

     Close(): void {
       this.dialogRef.close();
     }
   
   }


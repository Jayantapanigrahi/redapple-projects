import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HospitalService } from '../../_services';

import {first , tap, delay, map, startWith } from 'rxjs/operators';
@Component({
  selector: 'vex-medprofile',
  templateUrl: './medprofile.component.html',
  styleUrls: ['./medprofile.component.scss']
})
export class MedprofileComponent implements OnInit {
  employeeData:any;
  constructor(private route: ActivatedRoute,private hospitalService:HospitalService) {

   }

  ngOnInit() {

  	 this. route.params.subscribe(params => {
          console.log(params["compId"]);
          console.log(params["empId"])
          let condObj = {medical_card_number:params["empId"],code:params["compId"]};
          this.hospitalService.getMedProfile(condObj).subscribe(employeeData => {
               if(employeeData['status'] == '1')
               {
               	this.employeeData = employeeData['result'];
               }
           });
        });
  }

}

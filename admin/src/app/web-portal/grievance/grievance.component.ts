import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import { HomePageService } from './../_services';

import { Observable, of } from 'rxjs';
import {first , tap, delay,map } from 'rxjs/operators';

@Component({
  selector: 'app-grievance',
  templateUrl: './grievance.component.html',
  styleUrls: ['./grievance.component.scss']
})
export class GrievanceComponent implements OnInit {

 constructor(private homePageService:HomePageService) { }
 response:string;
  error:string;
  genderVal:string = 'male';
 Grievanceform = new FormGroup({
       created_by: new FormControl('',[Validators.required]),
       email: new FormControl('', [Validators.email]),
       phone_no: new FormControl('',[Validators.required]),
       gender: new FormControl('',[Validators.required]),
       state: new FormControl('',[Validators.required]),
       district: new FormControl('', [Validators.required]),
       address: new FormControl('',[Validators.required]),
       pin_code: new FormControl('',[Validators.required]),
       remarks_by_user: new FormControl('',[Validators.required]),
       grievance_image: new FormControl('', [Validators.required]),
    });
  get f() { return this.Grievanceform.controls; }
  ngOnInit() {
  }

  GrievanceformSubmit()
  {
     console.log(this.Grievanceform.value);
     if(this.Grievanceform.valid)
     {
      this.homePageService.AddGrievance(this.Grievanceform.value).pipe(first()).subscribe(request => {
      if(request['status'])
      	{
      		console.log(request); 
      		this.response = request['message']
      	}
      else{
         this.error = request['message'];
      }
      
     });
     }
     else
     {
       this.error = "All fields are required";
     }
     
  }

  omit_text(event) {
      var key;
      key = event.charCode;  //         key = event.keyCode;  (Both can be used)
      return ((key >= 48 && key <= 57));
    }

}

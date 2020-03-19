import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import { HomePageService } from './../_services';

import { Observable, of } from 'rxjs';
import {first , tap, delay,map } from 'rxjs/operators';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  constructor(private homePageService:HomePageService) { }
  response:string;
  error:string;
  Contactform = new FormGroup({
       user_name: new FormControl('',[Validators.required]),
       email: new FormControl('', [Validators.email]),
       contact_no: new FormControl('',[Validators.required]),
       message: new FormControl('',[Validators.required]),
    });
  get f() { return this.Contactform.controls; }

  ngOnInit() {
  }

  ContactformSubmit()
  {
     console.log(this.Contactform.value);
     if(this.Contactform.valid)
     {
      this.homePageService.contactUs(this.Contactform.value).pipe(first()).subscribe(request => {
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

}

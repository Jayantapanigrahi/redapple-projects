import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HospitalService } from './../_services';
import { Router,ActivatedRoute }      from '@angular/router';
@Component({
  selector: 'vex-dashboard',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.scss']
})
export class HospitalComponent implements OnInit {
   is_logged_in:boolean;
   user_type:any;
   user_name:string;
   user_image:string;
   user_role;
   active:any=1;
  constructor(private router: Router,public authService: AuthService,public hospitalService:HospitalService) { 
  this.is_logged_in = this.authService.isLoggedIn;
  this.user_type = this.authService.loggedUserType;
  this.user_name = this.authService.loggedUserName;
  this.user_role = this.authService.loggedUserScope;
  }

  ngOnInit() {
    this.hospitalService.loadAdminDetails({}).subscribe(request => {
      if(request['status'])
        {
         localStorage.setItem('user_image', request['result'].user_hospital.logo);
        }
        this.user_image = (localStorage.getItem('user_image'))?localStorage.getItem('user_image'):''; 
    });
    if(this.router.url == '/hospital/cil-employees'){
      this.active = '4';
    }
    else if(this.router.url == '/hospital/hospital-estimation-submission'){
      this.active = '5';
    }
    else if(this.router.url == '/hospital/dashboard'){
      this.active = '1';
    }
     else if(this.router.url == '/hospital/profile'){
      this.active = '2';
    }
     else if(this.router.url == '/hospital/de-users'){
      this.active = '3';
    }
    else if(this.router.url == '/hospital/hospital-bill-submission'){
      this.active = '6';
    }
   else if(this.router.url == '/hospital/hospital-bill-list'){
      this.active = '7';
    }
    else if(this.router.url == '/hospital/hospital-approved-bill-list'){
      this.active = '8';
    }
    else if(this.router.url == '/hospital/hospital-estimation-list'){
      this.active = '9';
    }
   else if(this.router.url == '/hospital/hospital-approved-estimation-list'){
      this.active = '10';
    }
   else if(this.router.url == '/hospital/hospital-comunication'){
      this.active = '11';
    }


  }
  setActive(menu){
    this.active = menu;
  }

}

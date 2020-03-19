import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { EmployeeService } from './../_services';
import {first , tap, delay,map } from 'rxjs/operators';
@Component({
  selector: 'vex-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  is_logged_in:boolean;
  user_type:any;
   user_name:string;
   user_image:string;
   active:any=1;
  constructor(public authService: AuthService,public employeeService:EmployeeService) { 
  this.is_logged_in = this.authService.isLoggedIn;
  this.user_type = this.authService.loggedUserType;
  this.user_name = this.authService.loggedUserName;
}

  ngOnInit() {
  	this.loadUserDetails();
  }
  loadUserDetails(){
  	this.employeeService.loadUserDetails({}).pipe(first()).subscribe(request => {
      if(request['status'])
        {
          localStorage.setItem('user_image', request['result'].employee.employee_image);
        }
        this.user_image = (localStorage.getItem('user_image'))?localStorage.getItem('user_image'):''; 
     });
  	
  }
  setActive(menu){
    this.active = menu;
  }

}

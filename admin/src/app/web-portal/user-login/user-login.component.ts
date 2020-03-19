import { Component, OnInit, Input,  Output, EventEmitter } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Router }      from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { AlertService } from '../../_alert';

@Component({
  selector: 'vex-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent{
       submitted = false;
       submitButtonVisible = false;
       LoginButtonVisible = true;
       otpFieldVisible = false;
       ResendButtonVisible = false;
       otpValue:any
       title:any;
       error_msg='';
       success_msg='';
       is_logged_in:boolean;
       user_type:any;
    constructor(public alertService:AlertService, public spinner: NgxSpinnerService,public authService: AuthService, public router: Router) {
       this.is_logged_in = this.authService.isLoggedIn;
       this.user_type = this.authService.loggedUserType;
       console.log(this.authService.isLoggedIn);console.log("#############");
        if(this.is_logged_in){
                       if(this.user_type == '6')
                        {
                        location.href = 'employee/dashboard';
                        }
                        if(this.user_type == '5')
                        {
                        location.href = 'hospital/cil-employees';
                        }
                     }
     }

    loginForm = new FormGroup({
       email:new FormControl('', [Validators.required,Validators.email]),
       password: new FormControl('',[Validators.required]),
       otp: new FormControl('')
    });
    get f() { return this.loginForm.controls; }

    submit() {
      if (this.loginForm.valid) { 
        this.authService.login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                  console.log("###");
                console.log(data);
                if(data.status == '0')
                    {
                      this.alertService.error(data.message);
                    }
                   else{
                    if(data.result.user_type_id == '6')
                    {
                    location.href = 'employee/dashboard';
                    }
                    if(data.result.user_type_id == '5')
                    {
                    location.href = 'hospital/cil-employees';
                    }
                   }
                },
                error => {
                    this.alertService.error(error);
                });      
   }
   else
   {
     this.submitted = true;  
   }
 }

   SendOTP(){
     this.submitted = false;     
       if(!this.f.email.value || !this.f.password.value)
       {
         this.submitted = true;  
       }
       else
       {
       this.authService.sendOTP(this.f.email.value)
            .pipe(first())
            .subscribe(
                data => {
                  if(data['status'] == '0')
                             {
                             this.alertService.warn(data['message']);
                              }
                              else
                              {
                                this.submitButtonVisible = true;
                                this.ResendButtonVisible = true;
                                this.LoginButtonVisible = false;
                                this.otpFieldVisible = true;
                                this.otpValue = data['result'].otp;
                                console.log(this.otpValue);
                                this.alertService.success(data['message']+this.otpValue);
                              }
                  },
                error => {
                  this.alertService.error('error'); 
                });
     }
   

   }
}

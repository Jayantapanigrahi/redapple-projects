import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService }      from './auth.service';
import {first, tap, delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmployeeAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    console.log(" located in auth.gaurd access_token :",localStorage.getItem('user_access_token'))
    console.log(this.authService.isLoggedIn);
      this.authService.isValisToken().subscribe(
                data => {
                    console.log(data);
                   if(data.status == '1' && this.authService.isLoggedIn){
                     return true; 
                   }
                   else if(data.status == '10'){
                        this.authService.sessionlogout();
                        confirm(data.message);
                        location.href = '/login';
                        //this.router.navigate(['/login']);
                        return false;
                   }
                   else{
                     this.authService.sessionlogout();
                      location.href = '/login';
                     //this.router.navigate(['/login']);
                     return false;
                   }
                  },
                error => {
                  this.authService.sessionlogout();
                   location.href = '/login';
                  //this.router.navigate(['/login']);
                  console.log(error);
                  return false;
                });
    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;
    if (this.authService.isLoggedIn) { 
       return true; 
        this.authService.redirectUrl = url;
      }
   location.href = '/login';
    return false;
  }


  checkToken(url: string): boolean {
    console.log(" located in auth.gaurd access_token :",localStorage.getItem('user_access_token'))
    if(localStorage.getItem('user_access_token')) { 
       if(localStorage.getItem('user_access_token')){
       this.authService.isValisToken().pipe(first()).subscribe(request => {
         console.log(request['status'])
         if(request['status'] == 1)
         {
            console.log(url);
            this.authService.redirectUrl = url;
            return true;
            
         }
         else{
           return false;
         }
        });
       }
       else{
         this.router.navigate(['/login']);
         return false;
       }
    }
    // // Store the attempted URL for redirecting
    // this.authService.redirectUrl = url;

    // // Navigate to the login page with extras
    // this.router.navigate(['/login']);
    // return false;
  }

}
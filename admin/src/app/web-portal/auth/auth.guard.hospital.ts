import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService }      from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardHospital implements CanActivate {
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
                   if(data.status == '1' && this.authService.isLoggedIn && this.authService.loggedUserType == '5'){
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
    if (this.authService.isLoggedIn && this.authService.loggedUserType == '5') { 
       return true; 
        this.authService.redirectUrl = url;
      }
   location.href = '/login';
   return false;
    
  }

}
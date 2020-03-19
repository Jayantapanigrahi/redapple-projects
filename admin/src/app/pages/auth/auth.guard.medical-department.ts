import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService }      from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardMedicalDepartment implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    console.log(" located in auth.gaurd access_token :",localStorage.getItem('user_access_token'))
    if (this.authService.isAdminLoggedIn && this.authService.loggedAdminType == '2') { 
       return true; 
    }
    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    location.href = 'Admin/login'
    //this.router.navigate(['/home']);
    return false;
  }

}
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService }      from './auth.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  isValidToken:boolean;
  constructor(private authService: AuthService, private router: Router) {
    
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
     
    
    let url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    this.authService.isValisToken().subscribe(
                data => {
                    console.log(data);
                   if(data.status == '1' && this.authService.isAdminLoggedIn){
                     return true; 
                   }
                   else if(data.status == '10'){
                       this.authService.logout();
                        confirm(data.message);
                        this.router.navigate(['Admin/login']);
                   }
                   else{
                     this.authService.logout();
                     this.router.navigate(['Admin/login']);
                   }
                  },
                error => {
                  isValidToken:false
                  this.authService.logout();
                  this.router.navigate(['Admin/login']);
                    console.log(error);
                });
    if (this.authService.isAdminLoggedIn) { 
       return true; 
      }
    this.router.navigate(['Admin/login']);
    return false;
  }

}
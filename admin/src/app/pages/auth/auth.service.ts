import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor,HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';

import { Observable, of } from 'rxjs';
import { tap, delay,map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {

  }
  isAdminLoggedIn = (localStorage.getItem('admin_access_token'))?true:false; 
  isTokenValid =    (localStorage.getItem('tokenValid'))?localStorage.getItem('tokenValid'):''; 
  loggedAdminType = (localStorage.getItem('admin_type_id'))?localStorage.getItem('admin_type_id'):''; 
  loggedAdminName = (localStorage.getItem('admin_name'))?localStorage.getItem('admin_name'):''; 
  loggedAdminScope = (localStorage.getItem('admin_access_scope'))?localStorage.getItem('admin_access_scope'):''; 
  loggedCompanyId = (localStorage.getItem('company_id'))?localStorage.getItem('company_id'):''; 
  
  // store the URL so we can redirect after logging in
 
  redirectUrl: string;

  login(email: string, password: string){
     return this.http.post<any>(`${environment.BASE_URL}admin/login`, { email, password })
      .pipe(map(fetchresult => {
      console.log(" user",fetchresult)
         
          if (fetchresult && fetchresult.result.access_token) {
              localStorage.setItem('admin_email', fetchresult.result.email);
              localStorage.setItem('admin_type_id', fetchresult.result.user_type_id);
              localStorage.setItem('admin_access_token', fetchresult.result.access_token); 
              localStorage.setItem('admin_name', fetchresult.result.firstname+fetchresult.result.lastname);
              localStorage.setItem('admin_access_scope', fetchresult.result.user_role);
              localStorage.setItem('company_id', (!fetchresult.result.employee)?'0':fetchresult.result.employee.company_id);
              this.isAdminLoggedIn = true;

              return fetchresult.result;
          }
          return fetchresult;
     }));
  }


  logout(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(val =>{
         localStorage.removeItem('admin_access_token');
         localStorage.removeItem('admin_name');
         localStorage.removeItem('admin_email');       
         localStorage.removeItem('admin_type_id');   
         localStorage.removeItem('admin_access_scope');       
         this.isAdminLoggedIn = false;
         })
    );
  }

  getToken() {
        return localStorage.getItem('admin_access_token')
    }

  isValisToken() {
    let token = localStorage.getItem('admin_access_token')
    return this.http.post<any>(`${environment.BASE_URL}admin/check-token`, {token})
      .pipe(map(fetchresult => {
         return fetchresult;
     }));
    }
  
}
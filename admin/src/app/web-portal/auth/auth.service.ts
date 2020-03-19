import { Injectable } from '@angular/core';
import { HttpRequest, HttpHeaders, HttpHandler, HttpEvent, HttpInterceptor,HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { Observable, of } from 'rxjs';
import { tap, delay,map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
   headers;
   access_token;
  constructor(private http: HttpClient) {}
  isLoggedIn = (localStorage.getItem('user_access_token'))?true:false; 
  loggedUserType = (localStorage.getItem('user_type_id'))?localStorage.getItem('user_type_id'):''; 
  loggedUserName = (localStorage.getItem('user_name'))?localStorage.getItem('user_name'):''; 
  loggedUserScope = (localStorage.getItem('access_scope'))?localStorage.getItem('access_scope'):''; 
  
  // store the URL so we can redirect after logging in
 
  redirectUrl: string;

  login(email: string, password: string){
     return this.http.post<any>(`${environment.BASE_URL}user/login`, { email, password })
      .pipe(map(fetchresult => {
         console.log(fetchresult);
         console.log("###");
          if (fetchresult && fetchresult.status == '1') {
              localStorage.setItem('user_type_id', fetchresult.result.user_type_id);
              localStorage.setItem('user_access_token', fetchresult.result.access_token); 
              localStorage.setItem('user_name', fetchresult.result.firstname);
              localStorage.setItem('access_scope', fetchresult.result.user_role);
              this.isLoggedIn = true;
          }
          return fetchresult;
     }));
  }




  sendOTP(mobile: string){
     return this.http.post<any>(`${environment.BASE_URL}generate-login-otp`, { communiaction_mode:'email', communication_details:mobile })
      .pipe(map(fetchresult => {
          return fetchresult;
     }));
  }

  logout(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(val =>{
         localStorage.removeItem('user_access_token');
         localStorage.removeItem('user_type_id');
         localStorage.removeItem('user_name');
         localStorage.removeItem('user_image');
         this.isLoggedIn = false;
         })
    );
  }

  sessionlogout(){
         console.log("####Called");
         localStorage.removeItem('user_access_token');
         localStorage.removeItem('user_type_id');
         localStorage.removeItem('user_name');
         localStorage.removeItem('user_image');
         this.isLoggedIn = false;
  }

  getToken() {
        return localStorage.getItem('user_access_token')
    }


  sendOtp(condition:any)
    {
        return this.http.post(`${environment.BASE_URL}generate-otp`,condition);
    }
  userSignUp(data:any)
    {
        return this.http.post(`${environment.BASE_URL}user/registration`,data);
    }
   hospitalSignUp(data:any)
    {
        return this.http.post(`${environment.BASE_URL}hospital/registration`,data);
    }


isValisToken() {
    let token = localStorage.getItem('user_access_token')
    return this.http.post<any>(`${environment.BASE_URL}admin/check-token`, {token})
      .pipe(map(fetchresult => {
         return fetchresult;
     }));
    }
  
}
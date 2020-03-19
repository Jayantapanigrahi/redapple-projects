import { Injectable } from '@angular/core';
import { HttpClient  , HttpHeaders} from '@angular/common/http';

import { environment } from '../../../environments/environment';
// import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class HomePageService {
  access_token;
  headers;
  constructor(private http: HttpClient) {
  //public authService: AuthService
  //           this.access_token = this.authService.getToken();
  //           this.headers = new  HttpHeaders().set("access_token", this.access_token);        
   }
loadHospitals(condition:any)
    {
        return this.http.post(`${environment.BASE_URL}empanelled-hospitals-list`,condition,{headers: this.headers});
    }
contactUs(condition:any)
  {
      return this.http.post(`${environment.BASE_URL}contact-us`,condition,{headers: this.headers});
  }
AddGrievance(condition:any)
  {
      return this.http.post(`${environment.BASE_URL}add-grievance`,condition,{headers: this.headers});
  }
loadCompany()
  {
      return this.http.get(`${environment.BASE_URL}company-list`);
  }
loadCghssList()
  {
      return this.http.post(`${environment.BASE_URL}cghss-list`,'');
  }

}

import { Injectable } from '@angular/core';
import { HttpClient  , HttpHeaders} from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  access_token;
  headers;
  constructor(private http: HttpClient,  public authService: AuthService) {
            this.access_token = this.authService.getToken();
            this.headers = new  HttpHeaders().set("access_token", this.access_token);        
   }

loadCompany()
  {
      return this.http.get(`${environment.BASE_URL}company-list`);
  }
loadUserDetails(condition:any)
    {
        return this.http.post(`${environment.BASE_URL}employee-details`,condition,{headers: this.headers});
    }
updateEmployee(updateData:any)
    {
        return this.http.post(`${environment.BASE_URL}employee-update`,updateData,{headers: this.headers});
    }
updateLifeCertificate(updateData:any)
    {
        return this.http.post(`${environment.BASE_URL}employee-life-certificate-update`,updateData,{headers: this.headers});
    }
getLifeCertificate()
    {
        return this.http.post(`${environment.BASE_URL}employee-get-life-certificate`,'',{headers: this.headers});
    }
loadEstimations(updateData:any)
    {
        return this.http.post(`${environment.BASE_URL}employee-estimation-list`,updateData,{headers: this.headers});
    }
getBill(condData:any)
  {
      return this.http.post(`${environment.BASE_URL}employee/get-bill`,condData,{headers: this.headers});
  }
}

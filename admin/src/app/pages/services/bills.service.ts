import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class BILLSService {
  access_token;
  headers;
  constructor(private http: HttpClient,  public authService: AuthService) {
            this.access_token = this.authService.getToken();
            this.headers = new  HttpHeaders().set("access_token", this.access_token);        
   }
    
    getAllbills(condObj:any) {
        return this.http.post(`${environment.BASE_URL}admin/billss-list`,condObj,{headers: this.headers});        
    }

    editbills(editbills)
    {
        return this.http.post(`${environment.BASE_URL}admin/edit-bills`,editbills,{headers: this.headers});
    }

    addbills(addbills)
    {
        return this.http.post(`${environment.BASE_URL}admin/add-bills`,addbills,{headers: this.headers});
    }

    getbillsbyID(bills_id) {
        return this.http.post(`${environment.BASE_URL}admin/bills-details`,bills_id,{headers: this.headers});
    }
    
        
}

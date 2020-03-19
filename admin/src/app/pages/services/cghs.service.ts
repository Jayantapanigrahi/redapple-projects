import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class CGHSService {
    access_token;
    headers;
    constructor(private http: HttpClient, public authService: AuthService) {
            this.access_token = this.authService.getToken();
            this.headers = new  HttpHeaders().set("access_token", this.access_token);        
    }    
    
    getAllCGHSs() {
        return this.http.post(`${environment.BASE_URL}admin/cghss-list`,'',{headers: this.headers});        
    }

    editCGHS(editcghs)
    {
        return this.http.post(`${environment.BASE_URL}admin/edit-cghs`,editcghs,{headers: this.headers});
    }

    addCGHS(addcghs)
    {
        return this.http.post(`${environment.BASE_URL}admin/add-cghs`,addcghs,{headers: this.headers});
    }

    getCGHSbyID(cghs_id) {
        return this.http.post(`${environment.BASE_URL}admin/cghs-details`,cghs_id,{headers: this.headers});
    }
    
        
}

import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class RolesAndResponsibilityService {
    access_token;
    headers;
    constructor(private http: HttpClient, public authService: AuthService) {
            this.access_token = this.authService.getToken();
            this.headers = new  HttpHeaders().set("access_token", this.access_token);        
    }    
    
    getAllRolesAndResponsibilitys() {
        return this.http.post(`${environment.BASE_URL}admin/medical-department-list`,'',{headers: this.headers});        
    }

    editRolesAndResponsibility(editRole)
    {
        return this.http.post(`${environment.BASE_URL}admin/edit-medical-department`,editRole,{headers: this.headers});
    }

    addRolesAndResponsibility(addRole)
    {
        return this.http.post(`${environment.BASE_URL}admin/add-medical-department`,addRole,{headers: this.headers});
    }

    getRolesAndResponsibilitybyID(Role_id) {
        return this.http.post(`${environment.BASE_URL}admin/medical-department-details`,Role_id,{headers: this.headers});
    }
    loadCompany()
      {
          return this.http.get(`${environment.BASE_URL}company-list`);
      }
    getDashboardList(condObj:any)
      {
          return this.http.post(`${environment.BASE_URL}admin/dashboard-listing`,condObj,{headers: this.headers});
      }
        
}

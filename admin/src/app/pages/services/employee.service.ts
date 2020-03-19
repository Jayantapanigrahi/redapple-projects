import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class Employeeservice {
  access_token;
  headers;
  constructor(private http: HttpClient,  public authService: AuthService) {
            this.access_token = this.authService.getToken();
            this.headers = new  HttpHeaders().set("access_token", this.access_token);        
   }
    
    getAllEmployees(condObj:any) {
        return this.http.post(`${environment.BASE_URL}admin/employee-list`,condObj,{headers: this.headers});        
    }
    loadCompany()
      {
          return this.http.get(`${environment.BASE_URL}company-list`);
      }
    editEmployees(editEmployees)
    {
        return this.http.post(`${environment.BASE_URL}admin/edit-employee`,editEmployees,{headers: this.headers});
    }
    
    updateEmployee(updateData:any)
    {
        return this.http.post(`${environment.BASE_URL}employee-update`,updateData,{headers: this.headers});
    }

    addEmployees(addEmployees)
    {
        return this.http.post(`${environment.BASE_URL}admin/add-employee`,addEmployees,{headers: this.headers});
    }

    getEmployeesbyID(Employees_id) {
        return this.http.post(`${environment.BASE_URL}admin/employee-details`,Employees_id,{headers: this.headers});
    }
    
        
}

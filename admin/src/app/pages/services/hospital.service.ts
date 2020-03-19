import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';


import { environment } from './../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class HospitalService {
    access_token;
    headers;
    constructor(private http: HttpClient, public authService: AuthService) {
            this.access_token = this.authService.getToken();
            this.headers = new  HttpHeaders().set("access_token", this.access_token);        
    }    
    
    getAllHospitals() {
        return this.http.post(`${environment.BASE_URL}admin/hospitals-list`,'',{headers: this.headers});        
    }

    editHospital(edithospital)
    {
        const fd = new FormData();
        fd.append('file',edithospital.file);
        fd.append('name',edithospital.name);
        console.log(fd);
        let url = `${environment.BASE_URL}admin/edit-hospital`
        //let options = new RequestOptions({ headers: this.headers })
        return this.http.post(url, fd, {headers: this.headers});
                        
        //return this.http.post(`${environment.BASE_URL}admin/edit-hospital`,fd,{headers: this.headers});
    }

    addHospital(addhospital)
    {
        return this.http.post(`${environment.BASE_URL}admin/add-hospital`,addhospital,{headers: this.headers});
    }

    editHospEmployees(editEmployees)
    {
        return this.http.post(`${environment.BASE_URL}admin/edit-employee`,editEmployees,{headers: this.headers});
    }
    
        
}

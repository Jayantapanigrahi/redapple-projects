import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';


import { environment } from './../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ProvisionalDiagnosisService {
    access_token;
    headers;
    constructor(private http: HttpClient, public authService: AuthService) {
            this.access_token = this.authService.getToken();
            this.headers = new  HttpHeaders().set("access_token", this.access_token);        
    }    
    
    getAllProvisionalDiagnosiss() {
        return this.http.post(`${environment.BASE_URL}admin/pd-list`,'',{headers: this.headers});        
    }

    editProvisionalDiagnosis(edithospital)
    {
        let url = `${environment.BASE_URL}admin/edit-pd`
        //let options = new RequestOptions({ headers: this.headers })
        return this.http.post(url, edithospital, {headers: this.headers});
                        
        //return this.http.post(`${environment.BASE_URL}admin/edit-hospital`,fd,{headers: this.headers});
    }

    addProvisionalDiagnosis(addhospital)
    {
        return this.http.post(`${environment.BASE_URL}admin/add-pd`,addhospital,{headers: this.headers});
    }
    
        
}

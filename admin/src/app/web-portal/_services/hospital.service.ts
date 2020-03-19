import { Injectable } from '@angular/core';
import { HttpClient  , HttpHeaders} from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class HospitalService {
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

 getAllProvisionalDiagnosiss() {
        return this.http.post(`${environment.BASE_URL}admin/pd-list`,'',{headers: this.headers});        
    }
loadCghssList()
  {
      return this.http.post(`${environment.BASE_URL}cghss-list`,'');
  }
loadAdminDetails(condition:any)
  {
      return this.http.post(`${environment.BASE_URL}hospital-details`,condition,{headers: this.headers});
  }
hospitalProfileUpdate(updateData:any)
  {
      return this.http.post(`${environment.BASE_URL}hospital/profile-update`,updateData,{headers: this.headers});
  }
loadUser(condition:any)
  {
      return this.http.post(`${environment.BASE_URL}get-hospital-user`,condition,{headers: this.headers});
  }
updateUser(updateData:any)
  {
      return this.http.post(`${environment.BASE_URL}update-hospital-user`,updateData,{headers: this.headers});
  }
addUser(addData:any)
  {
      return this.http.post(`${environment.BASE_URL}create-hospital-user`,addData,{headers: this.headers});
  }
loadCILEmployees(condObj:any)
  {
      return this.http.post(`${environment.BASE_URL}get-cil-employees`,condObj,{headers: this.headers});
  }
 addEstimation(addData:any)
  {
      return this.http.post(`${environment.BASE_URL}add-estimation`,addData,{headers: this.headers});
  }
 addBill(addData:any)
  {
      return this.http.post(`${environment.BASE_URL}add-bill`,addData,{headers: this.headers});
  }
 getBill(condData:any)
  {
      return this.http.post(`${environment.BASE_URL}hospital/get-bill`,condData,{headers: this.headers});
  }
 loadEstimations(condData:any)
  {
      return this.http.post(`${environment.BASE_URL}hospital/get-estimations`,condData,{headers: this.headers});
  }
 getAdmissiondetails(condData:any)
  {
      return this.http.post(`${environment.BASE_URL}hospital/get-admission-details`,condData,{headers: this.headers});
  }
 deleteBill(condData:any)
  {
      return this.http.post(`${environment.BASE_URL}hospital/delete-bill`,condData,{headers: this.headers});
  }
 ApproveBill(condData:any)
  {
      return this.http.post(`${environment.BASE_URL}hospital/update-bill`,condData,{headers: this.headers});
  }
 getAdmissionNo(condData:any)
  {
      return this.http.post(`${environment.BASE_URL}hospital/get-admission-number`,condData,{headers: this.headers});
  }
 getMedicalHistory(condData:any)
  {
      return this.http.post(`${environment.BASE_URL}hospital/get-medical-history`,condData,{headers: this.headers});
  }
 addComunication(adData:any)
  {
      return this.http.post(`${environment.BASE_URL}hospital/add-comunication`,adData,{headers: this.headers});
  }
 getComunication(condData:any)
  {
      return this.http.post(`${environment.BASE_URL}hospital/get-comunication`,condData,{headers: this.headers});
  }
 
 getMedProfile(condData:any)
  {
      return this.http.post(`${environment.BASE_URL}get-med-profile`,condData,{headers: this.headers});
  }
 

}

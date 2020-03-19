import { Injectable } from '@angular/core';
import { HttpClient  , HttpHeaders} from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class OpdService {
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
    return this.http.post(`${environment.BASE_URL}get-opd-user`,condition,{headers: this.headers});
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
  addOpd(addData:any)
  {
    return this.http.post(`${environment.BASE_URL}emp-opd`,addData,{headers: this.headers});
  }
  getBill(condData:any)
  {
    return this.http.post(`${environment.BASE_URL}hospital/get-bill`,condData,{headers: this.headers});
  }
  deleteOpd(condData:any)
  {
    return this.http.post(`${environment.BASE_URL}delete-opd`,condData,{headers: this.headers});
  }
  ApproveBill(condData:any)
  {
    return this.http.post(`${environment.BASE_URL}hospital/update-bill`,condData,{headers: this.headers});
  }


}

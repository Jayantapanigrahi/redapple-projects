import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  is_logged_in:boolean;
  user_type:any;
  user_name:string;
  constructor(public authService: AuthService) { 
  this.is_logged_in = this.authService.isLoggedIn;
  this.user_type = this.authService.loggedUserType;
  this.user_name = this.authService.loggedUserName;
  }

  ngOnInit() {

  }
  
  logout() {
        this.authService.logout() .subscribe(
            data => {
               location.href = '/'
                //this.router.navigate(['/home']);
            },
            error => {
               // this.alertService.error(error);
               // this.loading = false;
            });
   }
}

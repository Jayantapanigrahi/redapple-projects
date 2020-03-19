import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { AlertService } from '../../_alert';
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class WebLayoutComponent implements OnInit {
   constructor(private snackbar: MatSnackBar,public spinner: NgxSpinnerService,public alertService:AlertService,location: Location, router: Router) {
    router.events.subscribe(val => {
      this.snackbar.dismiss();
      this.spinner.show();
       document.body.scrollTop = 0;
      setTimeout(() => {
      this.spinner.hide();
      }, 400);
      });
    
    }

  ngOnInit() {
  	
  }
  

}

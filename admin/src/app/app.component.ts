import { Component, Inject, LOCALE_ID, Renderer2 } from '@angular/core';
import { ConfigName, ConfigService } from '../@vex/services/config.service';
import { MatIconRegistry } from '@angular/material/icon';
import { Settings } from 'luxon';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { NavigationService } from '../@vex/services/navigation.service';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icAssigment from '@iconify/icons-ic/twotone-assignment';
import { LayoutService } from '../@vex/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SplashScreenService } from '../@vex/services/splash-screen.service';
import { Style, StyleService } from '../@vex/services/style.service';
import { AuthService } from './../app/pages/auth/auth.service';
import icPersonOutline from '@iconify/icons-ic/twotone-person-outline';
import icViewCompact from '@iconify/icons-ic/twotone-view-compact';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vex';
  is_logged_in:boolean;
   admin_type:any;
   admin_name:string;
   admin_role;
  constructor(private configService: ConfigService,
              private styleService: StyleService,
              private iconRegistry: MatIconRegistry,
              private renderer: Renderer2,
              private platform: Platform,
              @Inject(DOCUMENT) private document: Document,
              @Inject(LOCALE_ID) private localeId: string,
              private layoutService: LayoutService,
              private route: ActivatedRoute,
              private navigationService: NavigationService,
              private splashScreenService: SplashScreenService,
              public authService: AuthService,) {

    this.is_logged_in = this.authService.isAdminLoggedIn;
    this.admin_type = this.authService.loggedAdminType;
    this.admin_name = this.authService.loggedAdminName;
    this.admin_role = this.authService.loggedAdminScope;

    console.log(this.is_logged_in);
    console.log(this.admin_type);
    console.log(this.admin_name);
    console.log(this.admin_role);
    console.log(this.authService.loggedCompanyId);
    this.iconRegistry.setDefaultFontSetClass('iconify');
    Settings.defaultLocale = this.localeId;

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, 'is-blink');
    }

    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('rtl') && coerceBooleanProperty(queryParamMap.get('rtl')))
    ).subscribe(queryParamMap => {
      this.document.body.dir = 'rtl';
      this.configService.updateConfig({
        rtl: true
      });
    });

    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('layout'))
    ).subscribe(queryParamMap => this.configService.setConfig(queryParamMap.get('layout') as ConfigName));

    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('style'))
    ).subscribe(queryParamMap => this.styleService.setStyle(queryParamMap.get('style') as Style));

  //####super_admin:1,medical_department:2,accounts_department:3,welfare_department:4,empanelled_hospital:5,employe:6###//
    if(this.admin_type == 1){
          this.navigationService.items = [
              { type: 'link',label: 'Dashboard',route: './',icon: icLayers},
              { type: 'link',label: 'Hospital Module',route: './hospital',icon: icAssigment},
              {type: 'link',label: 'CGHS Module',route: './cghs',icon: icAssigment},
              //{type: 'link',label: 'Provisional Diagnosis Module',route: './provisional-diagnosis',icon: icAssigment},
              {type: 'link',label: 'Comunication Module',route: './hospital-comunication',icon: icAssigment},
              {type: 'link',label: 'Roles And Responsibility Module',route: './roles-and-responsibility',icon: icAssigment},
              { type: 'dropdown',
                label: 'Bill Module',
                icon: icViewCompact,
                children: [ 
                {type: 'link',label: 'Approved Bills',route: './bills/approved',icon: icLayers}, 
                {type: 'link',label: 'Pending Bills',route: './bills/pending',icon: icLayers}, 
                {type: 'link',label: 'Rejected Bills',route: './bills/rejected',icon: icLayers},   
                ]
              },    
              { type: 'dropdown',
                label: 'Employee Module',
                icon: icPersonOutline,
                children: [ 
                {type: 'link',label: 'Approved Employees',route: './employee/approved',icon: icLayers}, 
                {type: 'link',label: 'Pending Employees',route: './employee/pending',icon: icLayers}, 
                 
                ]
              },         
              { type: 'dropdown',
                label: 'Estimation Module',
                icon: icViewCompact,
                children: [ 
                            {type: 'link',label: 'Approved Estimation',route: './estimations/approved',icon: icLayers},
                            {type: 'link',label: 'Pending Estimation',route: './estimations/pending',icon: icLayers},            
                          ]
             }, 

            ];
    }
    else if(this.admin_type == 2 && this.admin_role == 'admin'){
      this.navigationService.items = [
        {type: 'link',label: 'Dashboard',route: './',icon: icLayers},
        { type: 'dropdown',
                label: 'Estimation Module',
                icon: icViewCompact,
                children: [ 
                            {type: 'link',label: 'Approved Estimation',route: './medical-department/estimations/approved',icon: icLayers},
                            {type: 'link',label: 'Pending Estimation',route: './medical-department/estimations/pending',icon: icLayers},            
                          ]
         }, 
        { type: 'dropdown',
                label: 'Bill Module',
                icon: icViewCompact,
                children: [ 
                {type: 'link',label: 'Approved Bills',route: './medical-department/bills/approved',icon: icLayers}, 
                {type: 'link',label: 'Pending Bills',route: './medical-department/bills/pending',icon: icLayers}, 
                {type: 'link',label: 'Rejected Bills',route: './medical-department/bills/rejected',icon: icLayers},   
                ]
              },   
        {type: 'link',label: 'Scrutiny',route: './medical-department/scrutiny',icon: icLayers},
      ];
    }

    else if(this.admin_type == 4 && this.admin_role == 'admin'){
      this.navigationService.items = [
        {type: 'link',label: 'Dashboard',route: './',icon: icLayers},
        { type: 'dropdown',
                label: 'Employee Module',
                icon: icPersonOutline,
                children: [ 
                {type: 'link',label: 'Approved Employees',route: './welfare-department/employee/approved',icon: icLayers}, 
                {type: 'link',label: 'Pending Employees',route: './welfare-department/employee/pending',icon: icLayers}, 
                 
                ]
              },
      ];
    }

    else if(this.admin_type == 3 && this.admin_role == 'admin'){
      this.navigationService.items = [
        {type: 'link',label: 'Dashboard',route: './',icon: icLayers},
        { type: 'dropdown',
                label: 'Estimation Module',
                icon: icViewCompact,
                children: [ 
                            {type: 'link',label: 'Approved Estimation',route: './accounts-department/estimations/approved',icon: icLayers},
                            {type: 'link',label: 'Pending Estimation',route: './accounts-department/estimations/pending',icon: icLayers},            
                          ]
         }, 
        { type: 'dropdown',
                label: 'Bill Module',
                icon: icViewCompact,
                children: [ 
                {type: 'link',label: 'Approved Bills',route: './accounts-department/bills/approved',icon: icLayers}, 
                {type: 'link',label: 'Pending Bills',route: './accounts-department/bills/pending',icon: icLayers}, 
                {type: 'link',label: 'Rejected Bills',route: './accounts-department/bills/rejected',icon: icLayers},   
                ]
              }, 
        ];
    }

    else if(this.admin_type == 2 && this.admin_role == 'data_entry'){
      this.navigationService.items = [
        {type: 'link',label: 'Dashboard',route: './',icon: icLayers},
        { type: 'dropdown',
                label: 'Bill Module',
                icon: icViewCompact,
                children: [ 
                {type: 'link',label: 'Approved Bills',route: './medical-department/bills/approved',icon: icLayers}, 
                {type: 'link',label: 'Pending Bills',route: './medical-department/bills/pending',icon: icLayers}, 
                {type: 'link',label: 'Rejected Bills',route: './medical-department/bills/rejected',icon: icLayers},   
                ]
              },
        ];
    }
    else if(this.admin_type == 3 && this.admin_role == 'data_entry'){
      this.navigationService.items = [
        {type: 'link',label: 'Dashboard',route: './',icon: icLayers},
      ];
    }
    else if(this.admin_type == 4 && this.admin_role == 'data_entry'){
      this.navigationService.items = [
        {type: 'link',label: 'Dashboard',route: './',icon: icLayers},
        ];
    }
   
  }
}

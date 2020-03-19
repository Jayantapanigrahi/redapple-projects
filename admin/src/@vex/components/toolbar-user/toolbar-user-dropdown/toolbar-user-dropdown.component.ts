import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuItem } from '../interfaces/menu-item.interface';
import { trackById } from '../../../utils/track-by';
import icPerson from '@iconify/icons-ic/twotone-person';
import icSettings from '@iconify/icons-ic/twotone-settings';
import icAccountCircle from '@iconify/icons-ic/twotone-account-circle';
import icMoveToInbox from '@iconify/icons-ic/twotone-move-to-inbox';
import icListAlt from '@iconify/icons-ic/twotone-list-alt';
import icTableChart from '@iconify/icons-ic/twotone-table-chart';
import icCheckCircle from '@iconify/icons-ic/twotone-check-circle';
import icAccessTime from '@iconify/icons-ic/twotone-access-time';
import icDoNotDisturb from '@iconify/icons-ic/twotone-do-not-disturb';
import icOfflineBolt from '@iconify/icons-ic/twotone-offline-bolt';
import icChevronRight from '@iconify/icons-ic/twotone-chevron-right';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import icBusiness from '@iconify/icons-ic/twotone-business';
import icVerifiedUser from '@iconify/icons-ic/twotone-verified-user';
import icLock from '@iconify/icons-ic/twotone-lock';
import icNotificationsOff from '@iconify/icons-ic/twotone-notifications-off';
import { Icon } from '@visurel/iconify-angular';
import { PopoverRef } from '../../popover/popover-ref';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../../app/pages/auth/auth.service';

export interface OnlineStatus {
  id: 'online' | 'away' | 'dnd' | 'offline';
  label: string;
  icon: Icon;
  colorClass: string;
}

@Component({
  selector: 'vex-toolbar-user-dropdown',
  templateUrl: './toolbar-user-dropdown.component.html',
  styleUrls: ['./toolbar-user-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarUserDropdownComponent implements OnInit {
  adminuser:any
  admin_type:any;
  role:any;
  items: MenuItem[] = [
    {
      id: '1',
      icon: icAccountCircle,
      label: 'My Profile',
      description: 'Personal Information',
      colorClass: 'text-teal-500',
      route: 'Admin/pages/profile'
    }    
  ];

  statuses: OnlineStatus[] = [
    {
      id: 'online',
      label: 'Online',
      icon: icCheckCircle,
      colorClass: 'text-green-500'
    },
    {
      id: 'away',
      label: 'Away',
      icon: icAccessTime,
      colorClass: 'text-orange-500'
    },
    {
      id: 'dnd',
      label: 'Do not disturb',
      icon: icDoNotDisturb,
      colorClass: 'text-red-500'
    },
    {
      id: 'offline',
      label: 'Offline',
      icon: icOfflineBolt,
      colorClass: 'text-gray-500'
    }
  ];

  activeStatus: OnlineStatus = this.statuses[0];

  trackById = trackById;
  icPerson = icPerson;
  icSettings = icSettings;
  icChevronRight = icChevronRight;
  icArrowDropDown = icArrowDropDown;
  icBusiness = icBusiness;
  icVerifiedUser = icVerifiedUser;
  icLock = icLock;
  icNotificationsOff = icNotificationsOff;

  constructor(private cd: ChangeDetectorRef,
              private popoverRef: PopoverRef<ToolbarUserDropdownComponent>,
              public authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.adminuser = localStorage.getItem('admin_name');    
    this.adminuser = localStorage.getItem('admin_name');
    if(localStorage.getItem('admin_type_id') == '1'){
      this.admin_type = 'COAL ADMIN'
     }
    if(localStorage.getItem('admin_type_id') == '2'){
      this.admin_type = 'Medical Department'
     }
     if(localStorage.getItem('admin_type_id') == '3'){
      this.admin_type = 'Accounts Department'
     }
     if(localStorage.getItem('admin_type_id') == '4'){
      this.admin_type = 'Welfare Department'
     }
     if(localStorage.getItem('admin_access_scope') == 'admin')
     {
     this.role = 'Admin';
     }
     else
     {
        this.role = 'Data Entry';
     }
  }

  setStatus(status: OnlineStatus) {
    this.activeStatus = status;
    this.cd.markForCheck();
  }

  close() {
    
                this.popoverRef.close();
                
    
  }

  logOut() {
    this.authService.logout() .subscribe(
            data => {
                this.popoverRef.close();
                this.router.navigate(['Admin/login']);
            },
            error => {
               // this.alertService.error(error);
               // this.loading = false;
            });
    
  }
}

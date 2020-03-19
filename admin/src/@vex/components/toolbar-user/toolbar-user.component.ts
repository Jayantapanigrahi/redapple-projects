import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PopoverService } from '../popover/popover.service';
import { ToolbarUserDropdownComponent } from './toolbar-user-dropdown/toolbar-user-dropdown.component';
import icPerson from '@iconify/icons-ic/twotone-person';
import theme from '../../utils/tailwindcss';


@Component({
  selector: 'vex-toolbar-user',
  templateUrl: './toolbar-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarUserComponent implements OnInit {

  dropdownOpen: boolean;
  icPerson = icPerson;

  theme = theme;
  adminuser:any
  admin_type:any;
  role:any;

  constructor(private popover: PopoverService,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
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

  showPopover(originRef: HTMLElement) {
    this.dropdownOpen = true;
    this.cd.markForCheck();

    const popoverRef = this.popover.open({
      content: ToolbarUserDropdownComponent,
      origin: originRef,
      offsetY: 12,
      position: [
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ]
    });

    popoverRef.afterClosed$.subscribe(() => {
      this.dropdownOpen = false;
      this.cd.markForCheck();
    });
  }
}

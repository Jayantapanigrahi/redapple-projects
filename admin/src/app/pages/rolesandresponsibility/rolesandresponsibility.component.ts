import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { RolesAndResponsibility } from './interfaces/rolesandresponsibility.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../@vex/interfaces/table-column.interface';
import { RolesAndResponsibilityreateUpdateComponent } from './rolesandresponsibility-create-update/rolesandresponsibility-create-update.component';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import { SelectionModel } from '@angular/cdk/collections';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icFolder from '@iconify/icons-ic/twotone-folder';
import { fadeInUp400ms } from '../../../@vex/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from '../../../@vex/animations/stagger.animation';
import { FormControl } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { MatSelectChange } from '@angular/material/select';
import theme from '../../../@vex/utils/tailwindcss';

import { RolesAndResponsibilityService } from '../../../app/pages/services/rolesandresponsibility.service';

@Component({
  selector: 'vex-rolesandresponsibility',
  templateUrl: './rolesandresponsibility.component.html',
  styleUrls: ['./rolesandresponsibility.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class RolesAndResponsibilityComponent implements OnInit, AfterViewInit, OnDestroy {

  layoutCtrl = new FormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<RolesAndResponsibility[]> = new ReplaySubject<RolesAndResponsibility[]>(1);
  data$: Observable<RolesAndResponsibility[]> = this.subject$.asObservable();
  rolesandresponsibilities: RolesAndResponsibility[];

  @Input()
  columns: TableColumn<RolesAndResponsibility>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Employee Id', property: 'employee_id', type: 'text', visible: true },
    { label: 'Mobile', property: 'mobile', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Email', property: 'email', type: 'text', visible: true },
    { label: 'Firstname', property: 'firstname', type: 'text', visible: true },
    { label: 'Lastname', property: 'lastname', type: 'text', visible: true },
    { label: 'Department', property: 'department', type: 'text', visible: true },
    { label: 'Designation', property: 'designation', type: 'text', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<RolesAndResponsibility> | null;
  selection = new SelectionModel<RolesAndResponsibility>(true, []);
  searchCtrl = new FormControl();

  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;
  labels:any;

  theme = theme;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private dialog: MatDialog, private rolesAndResponsibilityService:RolesAndResponsibilityService) {
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  

  ngOnInit() {
    
    this.rolesAndResponsibilityService.getAllRolesAndResponsibilitys().subscribe(rolesandresponsibilities => {
      //console.log(rolesandresponsibilities);
      this.rolesandresponsibilities = rolesandresponsibilities["result"]["rolesResponsibility"];
      this.subject$.next(this.rolesandresponsibilities);   
    });

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter<RolesAndResponsibility[]>(Boolean)
    ).subscribe(rolesandresponsibilities => {
      this.rolesandresponsibilities = rolesandresponsibilities;
      this.dataSource.data = rolesandresponsibilities;
    });

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }
 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createRolesAndResponsibility() {
    this.dialog.open(RolesAndResponsibilityreateUpdateComponent).afterClosed().subscribe((rolesandresponsibility: RolesAndResponsibility) => {
      /**
       * RolesAndResponsibility is the updated rolesandresponsibility (if the user pressed Save - otherwise it's null)
       */
      if (rolesandresponsibility) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.rolesandresponsibilities.unshift(new RolesAndResponsibility(rolesandresponsibility));
        this.subject$.next(this.rolesandresponsibilities);
      }
    });
  }

  updateRolesAndResponsibility(rolesandresponsibility: RolesAndResponsibility) {
    this.dialog.open(RolesAndResponsibilityreateUpdateComponent, {
      data: rolesandresponsibility
    }).afterClosed().subscribe(updatedRolesAndResponsibility => {
      /**
       * RolesAndResponsibility is the updated rolesandresponsibility (if the user pressed Save - otherwise it's null)
       */
      if (updatedRolesAndResponsibility) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        const index = this.rolesandresponsibilities.findIndex((existingRolesAndResponsibility) => existingRolesAndResponsibility.id === updatedRolesAndResponsibility.id);
        
        let rolesandresponsibilitiesObj = {
          id: (!updatedRolesAndResponsibility.id)?this.rolesandresponsibilities[index].id:updatedRolesAndResponsibility.id,
          employee_id: (!updatedRolesAndResponsibility.employee_id)?this.rolesandresponsibilities[index].employee_id:updatedRolesAndResponsibility.employee_id,
          mobile: (!updatedRolesAndResponsibility.mobile)?this.rolesandresponsibilities[index].mobile:updatedRolesAndResponsibility.mobile,
          email: (!updatedRolesAndResponsibility.email)?this.rolesandresponsibilities[index].email:updatedRolesAndResponsibility.email,
          firstname: (!updatedRolesAndResponsibility.firstname)?this.rolesandresponsibilities[index].firstname:updatedRolesAndResponsibility.firstname,
          lastname: (!updatedRolesAndResponsibility.lastname)?this.rolesandresponsibilities[index].lastname:updatedRolesAndResponsibility.lastname,
          department: (!updatedRolesAndResponsibility.department)?this.rolesandresponsibilities[index].department:updatedRolesAndResponsibility.department,          
          designation: (!updatedRolesAndResponsibility.designation)?this.rolesandresponsibilities[index].designation:updatedRolesAndResponsibility.designation          
        };
        this.rolesandresponsibilities[index] = new RolesAndResponsibility(rolesandresponsibilitiesObj);
        this.subject$.next(this.rolesandresponsibilities);
      }
    });
  }

  deleteRolesAndResponsibility(rolesandresponsibility: RolesAndResponsibility) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    rolesandresponsibility.updated_at = new Date();
    this.rolesAndResponsibilityService.editRolesAndResponsibility(rolesandresponsibility).subscribe(cs => {
      if(cs){
          this.rolesandresponsibilities.splice(this.rolesandresponsibilities.findIndex((existingRolesAndResponsibility) => existingRolesAndResponsibility.id === rolesandresponsibility.id), 1);
          this.selection.deselect(rolesandresponsibility);
          this.subject$.next(this.rolesandresponsibilities);
      }
    });
  }

  deleteRolesAndResponsibilitys(rolesandresponsibilities: RolesAndResponsibility[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    rolesandresponsibilities.forEach(c => this.deleteRolesAndResponsibility(c));
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange, row: RolesAndResponsibility) {
    const index = this.rolesandresponsibilities.findIndex(c => c === row);
    this.rolesandresponsibilities[index].labels = change.value;
    this.subject$.next(this.rolesandresponsibilities);
  }

  ngOnDestroy() {
  }
}

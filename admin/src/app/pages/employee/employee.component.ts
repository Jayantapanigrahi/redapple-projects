import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Employee } from './interfaces/employee.model';
import { Router,ActivatedRoute }      from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../@vex/interfaces/table-column.interface';
import { EmployeeCreateUpdateComponent } from './employee-create-update/employee-create-update.component';
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

import { Employeeservice } from '../../../app/pages/services/employee.service';

@Component({
  selector: 'vex-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
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
export class EmployeesComponent implements OnInit, AfterViewInit, OnDestroy {

  layoutCtrl = new FormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Employee[]> = new ReplaySubject<Employee[]>(1);
  data$: Observable<Employee[]> = this.subject$.asObservable();
  employee: Employee[];
  type:string;

  @Input()
  columns: TableColumn<Employee>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'First name', property: 'firstname', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Lastname', property: 'lastname', type: 'text', visible: true },
    { label: 'Email', property: 'email', type: 'text', visible: true },
    { label: 'Mobile No', property: 'mobile', type: 'text', visible: true },
    { label: 'Designation', property: 'designation', type: 'text', visible: true },
    { label: 'Verified', property: 'verified_by_admin', type: 'text', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Employee> | null;
  selection = new SelectionModel<Employee>(true, []);
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

  constructor(private router: Router,private route: ActivatedRoute,private dialog: MatDialog, private employeeservice:Employeeservice) {
  this.route.params.subscribe(params => {
          if(params['type'] == 'approved')
          {
            this.type = 'yes';
          }
          else{
            this.type = 'no';
          }
          this.getEmployee();
      })
   
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */


  ngOnInit() {
   this.getEmployee();
    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter<Employee[]>(Boolean)
    ).subscribe(employee => {
      this.employee = employee;
      this.dataSource.data = employee;
    });

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }
  
  getEmployee()
  {
    this.employeeservice.getAllEmployees({type:this.type}).subscribe(employee => {
      //console.log(employee);
      this.employee = employee["result"];
      console.log(this.employee);
      this.subject$.next(this.employee);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createEmployees() {
    this.dialog.open(EmployeeCreateUpdateComponent).afterClosed().subscribe((employee: Employee) => {
      /**
       * Employee is the updated employee (if the user pressed Save - otherwise it's null)
       */
      if (employee) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.employee.unshift(new Employee(employee));
        this.subject$.next(this.employee);
      }
    });
  }

  updateEmployees(employee: Employee) {
    console.log(employee)
    this.dialog.open(EmployeeCreateUpdateComponent, {
      data: employee
    }).afterClosed().subscribe(updatedEmployees => {
      /**
       * Employee is the updated employee (if the user pressed Save - otherwise it's null)
       */
      if (updatedEmployees) {
        this.ngOnInit();
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        // const index = this.employee.findIndex((existingEmployees) => existingEmployees.id === updatedEmployees.id);

        // let cghsObj = {
        //   id: (!updatedEmployees.id)?this.employee[index].id:updatedEmployees.id,
        //   code: (!updatedEmployees.code)?this.employee[index].code:updatedEmployees.code,
        //   dispensary_name: (!updatedEmployees.dispensary_name)?this.employee[index].dispensary_name:updatedEmployees.dispensary_name,
        //   location: (!updatedEmployees.location)?this.employee[index].location:updatedEmployees.location,
        //   treatment_description: (!updatedEmployees.treatment_description)?this.employee[index].treatment_description:updatedEmployees.treatment_description,
        //   rate: (!updatedEmployees.rate)?this.employee[index].rate:updatedEmployees.rate
        //
        // };
        // this.employee[index] = new Employee(cghsObj);
        // this.subject$.next(this.employee);

      }
    });
  }

  deleteEmployees(employee: Employee) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    //employee.updated_at = new Date();
    this.employeeservice.editEmployees(employee).subscribe(cs => {
      if(cs){
          this.employee.splice(this.employee.findIndex((existingEmployees) => existingEmployees.id === employee.id), 1);
          this.selection.deselect(employee);
          this.subject$.next(this.employee);
      }
    });
  }

  deleteEmployeess(employee: Employee[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    employee.forEach(c => this.deleteEmployees(c));
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

  onLabelChange(change: MatSelectChange, row: Employee) {
    const index = this.employee.findIndex(c => c === row);
    //this.employee[index].labels = change.value;
    this.subject$.next(this.employee);
  }

  ngOnDestroy() {
  }
}

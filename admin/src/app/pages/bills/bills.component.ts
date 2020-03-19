import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Router,ActivatedRoute }      from '@angular/router';
import { BILLS } from './interfaces/bills.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../@vex/interfaces/table-column.interface';
import { BILLSCreateUpdateComponent } from './bills-create-update/bills-create-update.component';
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
import { AuthService } from '../../../app/pages/auth/auth.service';

import { BILLSService } from '../../../app/pages/services/bills.service';

@Component({
  selector: 'vex-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
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
export class BILLSComponent implements OnInit, AfterViewInit, OnDestroy {

  layoutCtrl = new FormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<BILLS[]> = new ReplaySubject<BILLS[]>(1);
  data$: Observable<BILLS[]> = this.subject$.asObservable();
  bills: BILLS[];

  @Input()
  columns: TableColumn<BILLS>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Hospital', property: 'hospital', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Employee', property: 'employee', type: 'text', visible: true },
    { label: 'Submit date', property: 'hospital_submit_date', type: 'text', visible: true },
    { label: 'Medical service description', property: 'medical_service_description', type: 'text', visible: true },
    { label: 'Line of treatment', property: 'line_of_treatment', type: 'text', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<BILLS> | null;
  selection = new SelectionModel<BILLS>(true, []);
  searchCtrl = new FormControl();

  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;
  labels:any;
  type:string
  admin_type:any;

  theme = theme;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public authService: AuthService,private router: Router,private route: ActivatedRoute,private dialog: MatDialog, private billsService:BILLSService) {
   this.admin_type = this.authService.loggedAdminType;
    route.params.subscribe(params => {
          if(params['type'] == 'approved')
          {
            this.type = 'approved';
           
          }
          else if(params['type'] == 'rejected'){
            this.type = 'rejected';
           
          }
          else{
             this.type = 'pending';
             
          }
          this.getBills();
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
    
    this.getBills();
    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter<BILLS[]>(Boolean)
    ).subscribe(bills => {
      this.bills = bills;
      this.dataSource.data = bills;
    });

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }


  getBills()
  {

    this.billsService.getAllbills({type:this.type,admin_type:this.admin_type}).subscribe(bills => {
      //console.log(bills);
      this.bills = bills["result"];
      console.log(this.bills);
      this.subject$.next(this.bills);   
    });
  }
 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createBILLS() {
    this.dialog.open(BILLSCreateUpdateComponent).afterClosed().subscribe((bills: BILLS) => {
      /**
       * BILLS is the updated bills (if the user pressed Save - otherwise it's null)
       */
      if (bills) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.bills.unshift(new BILLS(bills));
        this.subject$.next(this.bills);
      }
    });
  }

  updateBILLS(bill: BILLS) {
    console.log(bill)
    this.dialog.open(BILLSCreateUpdateComponent, {
      data: bill
    }).afterClosed().subscribe(updatedBILLS => {
      /**
       * BILLS is the updated bills (if the user pressed Save - otherwise it's null)
       */
      if (updatedBILLS) {
        this.ngOnInit();
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        // const index = this.bills.findIndex((existingBILLS) => existingBILLS.id === updatedBILLS.id);
        
        // let cghsObj = {
        //   id: (!updatedBILLS.id)?this.bills[index].id:updatedBILLS.id,
        //   code: (!updatedBILLS.code)?this.bills[index].code:updatedBILLS.code,
        //   dispensary_name: (!updatedBILLS.dispensary_name)?this.bills[index].dispensary_name:updatedBILLS.dispensary_name,
        //   location: (!updatedBILLS.location)?this.bills[index].location:updatedBILLS.location,
        //   treatment_description: (!updatedBILLS.treatment_description)?this.bills[index].treatment_description:updatedBILLS.treatment_description,
        //   rate: (!updatedBILLS.rate)?this.bills[index].rate:updatedBILLS.rate          
        // 
        // };
        // this.bills[index] = new BILLS(cghsObj);
        // this.subject$.next(this.bills);

      }
    });
  }

  deleteBILLS(bills: BILLS) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    bills.updated_at = new Date();
    this.billsService.editbills(bills).subscribe(cs => {
      if(cs){
          this.bills.splice(this.bills.findIndex((existingBILLS) => existingBILLS.id === bills.id), 1);
          this.selection.deselect(bills);
          this.subject$.next(this.bills);
      }
    });
  }

  deleteBILLSs(bills: BILLS[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    bills.forEach(c => this.deleteBILLS(c));
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

  onLabelChange(change: MatSelectChange, row: BILLS) {
    const index = this.bills.findIndex(c => c === row);
    this.bills[index].labels = change.value;
    this.subject$.next(this.bills);
  }

  ngOnDestroy() {
  }
}

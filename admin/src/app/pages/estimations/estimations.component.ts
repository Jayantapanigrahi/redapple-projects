import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Estimations } from './interfaces/estimations.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../@vex/interfaces/table-column.interface';
import { EstimationsCreateUpdateComponent } from './estimations-create-update/estimations-create-update.component';
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
import { Router,ActivatedRoute }      from '@angular/router';

import { EstimationsService } from '../../../app/pages/services/estimations.service';
import { AuthService } from '../../../app/pages/auth/auth.service';

@Component({
  selector: 'vex-estimations',
  templateUrl: './estimations.component.html',
  styleUrls: ['./estimations.component.scss'],
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
export class EstimationsComponent implements OnInit, AfterViewInit, OnDestroy {

  layoutCtrl = new FormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Estimations[]> = new ReplaySubject<Estimations[]>(1);
  data$: Observable<Estimations[]> = this.subject$.asObservable();
  estimations: Estimations[];

  @Input()
  columns: TableColumn<Estimations>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Hospital', property: 'hospital_name', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Employee', property: 'employee_name', type: 'text', visible: true },
    { label: 'Admission Number', property: 'admission_number', type: 'text', visible: true },
    { label: 'Admission Date', property: 'date_of_admission', type: 'text', visible: true },
    { label: 'Total estimated amount', property: 'totaol_claimed_amount', type: 'text', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Estimations> | null;
  selection = new SelectionModel<Estimations>(true, []);
  searchCtrl = new FormControl();

  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;
  labels:any;
  list_type:any;
  theme = theme;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public authService: AuthService,private dialog: MatDialog,private route: ActivatedRoute, private estimationsService:EstimationsService) {
    route.params.subscribe(params => {
          if(params['type'] == 'approved')
          {
            this.list_type = 'approved';
           
          }
          else if(params['type'] == 'rejected'){
            this.list_type = 'rejected';
           
          }
          else{
             this.list_type = 'pending';
             
          }
          this.getEstimations();
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
    
    this.getEstimations();
    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter<Estimations[]>(Boolean)
    ).subscribe(estimations => {
      this.estimations = estimations;
      this.dataSource.data = estimations;
    });

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }
 
  getEstimations(){
    var condObj;
    if(this.authService.loggedCompanyId != '0'){
      condObj = {company_id:this.authService.loggedCompanyId,list_type:this.list_type};
    }
    else{
      condObj = {list_type:this.list_type};
    }
    this.estimationsService.getAllestimations(condObj).subscribe(estimations => {
      //console.log(estimations);
      this.estimations = estimations["result"];
      console.log(this.estimations);
      this.subject$.next(this.estimations);   
    });

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createEstimations() {
    this.dialog.open(EstimationsCreateUpdateComponent).afterClosed().subscribe((estimations: Estimations) => {
      /**
       * Estimations is the updated estimations (if the user pressed Save - otherwise it's null)
       */
      if (estimations) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.estimations.unshift(new Estimations(estimations));
        this.subject$.next(this.estimations);
      }
    });
  }

  updateEstimations(bill: Estimations) {
    console.log(bill)
    this.dialog.open(EstimationsCreateUpdateComponent, {
      data: bill
    }).afterClosed().subscribe(updatedEstimations => {
      /**
       * Estimations is the updated estimations (if the user pressed Save - otherwise it's null)
       */
      if (updatedEstimations) {
        this.ngOnInit();
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        // const index = this.estimations.findIndex((existingEstimations) => existingEstimations.id === updatedEstimations.id);
        
        // let cghsObj = {
        //   id: (!updatedEstimations.id)?this.estimations[index].id:updatedEstimations.id,
        //   code: (!updatedEstimations.code)?this.estimations[index].code:updatedEstimations.code,
        //   dispensary_name: (!updatedEstimations.dispensary_name)?this.estimations[index].dispensary_name:updatedEstimations.dispensary_name,
        //   location: (!updatedEstimations.location)?this.estimations[index].location:updatedEstimations.location,
        //   treatment_description: (!updatedEstimations.treatment_description)?this.estimations[index].treatment_description:updatedEstimations.treatment_description,
        //   rate: (!updatedEstimations.rate)?this.estimations[index].rate:updatedEstimations.rate          
        // 
        // };
        // this.estimations[index] = new Estimations(cghsObj);
        // this.subject$.next(this.estimations);

      }
    });
  }

  deleteEstimations(estimations: Estimations) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    estimations.updated_at = new Date();
    this.estimationsService.editestimations(estimations).subscribe(cs => {
      if(cs){
          this.estimations.splice(this.estimations.findIndex((existingEstimations) => existingEstimations.id === estimations.id), 1);
          this.selection.deselect(estimations);
          this.subject$.next(this.estimations);
      }
    });
  }

  deleteEstimationss(estimations: Estimations[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    estimations.forEach(c => this.deleteEstimations(c));
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

  onLabelChange(change: MatSelectChange, row: Estimations) {
    const index = this.estimations.findIndex(c => c === row);
    this.estimations[index].labels = change.value;
    this.subject$.next(this.estimations);
  }

  ngOnDestroy() {
  }
}

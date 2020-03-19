import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CGHS } from './interfaces/cghs.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../@vex/interfaces/table-column.interface';
import { CGHSCreateUpdateComponent } from './cghs-create-update/cghs-create-update.component';
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

import { CGHSService } from '../../../app/pages/services/cghs.service';

@Component({
  selector: 'vex-cghs',
  templateUrl: './cghs.component.html',
  styleUrls: ['./cghs.component.scss'],
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
export class CGHSComponent implements OnInit, AfterViewInit, OnDestroy {

  layoutCtrl = new FormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<CGHS[]> = new ReplaySubject<CGHS[]>(1);
  data$: Observable<CGHS[]> = this.subject$.asObservable();
  cghss: CGHS[];

  @Input()
  columns: TableColumn<CGHS>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Code', property: 'code', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Dispensary Name', property: 'dispensary_name', type: 'text', visible: true },
    { label: 'Location', property: 'location', type: 'text', visible: true },
    { label: 'Treatment Description', property: 'treatment_description', type: 'text', visible: true },
    { label: 'Rate', property: 'rate', type: 'text', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<CGHS> | null;
  selection = new SelectionModel<CGHS>(true, []);
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

  constructor(private dialog: MatDialog, private cghsService:CGHSService) {
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  

  ngOnInit() {
    
    this.cghsService.getAllCGHSs().subscribe(cghss => {
      //console.log(cghss);
      this.cghss = cghss["result"]["cghss"];
      this.subject$.next(this.cghss);   
    });

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter<CGHS[]>(Boolean)
    ).subscribe(cghss => {
      this.cghss = cghss;
      this.dataSource.data = cghss;
    });

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }
 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createCGHS() {
    this.dialog.open(CGHSCreateUpdateComponent).afterClosed().subscribe((cghs: CGHS) => {
      /**
       * CGHS is the updated cghs (if the user pressed Save - otherwise it's null)
       */
      if (cghs) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.cghss.unshift(new CGHS(cghs));
        this.subject$.next(this.cghss);
      }
    });
  }

  updateCGHS(cghs: CGHS) {
    this.dialog.open(CGHSCreateUpdateComponent, {
      data: cghs
    }).afterClosed().subscribe(updatedCGHS => {
      /**
       * CGHS is the updated cghs (if the user pressed Save - otherwise it's null)
       */
      if (updatedCGHS) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        const index = this.cghss.findIndex((existingCGHS) => existingCGHS.id === updatedCGHS.id);
        
        let cghsObj = {
          id: (!updatedCGHS.id)?this.cghss[index].id:updatedCGHS.id,
          code: (!updatedCGHS.code)?this.cghss[index].code:updatedCGHS.code,
          dispensary_name: (!updatedCGHS.dispensary_name)?this.cghss[index].dispensary_name:updatedCGHS.dispensary_name,
          location: (!updatedCGHS.location)?this.cghss[index].location:updatedCGHS.location,
          treatment_description: (!updatedCGHS.treatment_description)?this.cghss[index].treatment_description:updatedCGHS.treatment_description,
          rate: (!updatedCGHS.rate)?this.cghss[index].rate:updatedCGHS.rate          
        };
        this.cghss[index] = new CGHS(cghsObj);
        this.subject$.next(this.cghss);
      }
    });
  }

  deleteCGHS(cghs: CGHS) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    cghs.updated_at = new Date();
    this.cghsService.editCGHS(cghs).subscribe(cs => {
      if(cs){
          this.cghss.splice(this.cghss.findIndex((existingCGHS) => existingCGHS.id === cghs.id), 1);
          this.selection.deselect(cghs);
          this.subject$.next(this.cghss);
      }
    });
  }

  deleteCGHSs(cghss: CGHS[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    cghss.forEach(c => this.deleteCGHS(c));
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

  onLabelChange(change: MatSelectChange, row: CGHS) {
    const index = this.cghss.findIndex(c => c === row);
    this.cghss[index].labels = change.value;
    this.subject$.next(this.cghss);
  }

  ngOnDestroy() {
  }
}

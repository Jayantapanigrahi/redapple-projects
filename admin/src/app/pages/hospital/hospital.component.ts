import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Hospital } from './interfaces/hospital.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../@vex/interfaces/table-column.interface';
import { HospitalCreateUpdateComponent } from './hospital-create-update/hospital-create-update.component';
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

import { HospitalService } from '../../../app/pages/services/hospital.service';

@Component({
  selector: 'vex-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.scss'],
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
export class HospitalComponent implements OnInit, AfterViewInit, OnDestroy {

  layoutCtrl = new FormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Hospital[]> = new ReplaySubject<Hospital[]>(1);
  data$: Observable<Hospital[]> = this.subject$.asObservable();
  hospitals: Hospital[];

  @Input()
  columns: TableColumn<Hospital>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Image', property: 'image', type: 'image', visible: false },
    { label: 'Name', property: 'name', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Address', property: 'address', type: 'text', visible: true },
    { label: 'Description', property: 'description', type: 'text', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Hospital> | null;
  selection = new SelectionModel<Hospital>(true, []);
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

  constructor(private dialog: MatDialog, private hospitalService:HospitalService) {
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  

  ngOnInit() {
    
    this.hospitalService.getAllHospitals().subscribe(hospitals => {
      //console.log(hospitals);
      this.hospitals = hospitals["result"]["hospitals"];
      this.subject$.next(this.hospitals);   
    });

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter<Hospital[]>(Boolean)
    ).subscribe(hospitals => {
      this.hospitals = hospitals;
      this.dataSource.data = hospitals;
    });

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }
 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createHospital() {
    this.dialog.open(HospitalCreateUpdateComponent).afterClosed().subscribe((hospital: Hospital) => {
      /**
       * Hospital is the updated hospital (if the user pressed Save - otherwise it's null)
       */
      if (hospital) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.hospitals.unshift(new Hospital(hospital));
        this.subject$.next(this.hospitals);
      }
    });
  }

  updateHospital(hospital: Hospital) {
    this.dialog.open(HospitalCreateUpdateComponent, {
      data: hospital
    }).afterClosed().subscribe(updatedHospital => {
      /**
       * Hospital is the updated hospital (if the user pressed Save - otherwise it's null)
       */
       this.ngOnInit();
      // if (updatedHospital) {
      //   /**
      //    * Here we are updating our local array.
      //    * You would probably make an HTTP request here.
      //    */
      //   const index = this.hospitals.findIndex((existingHospital) => existingHospital.id === updatedHospital.id);
        
      //   let hospitalObj = {
      //     id: (!updatedHospital.id)?this.hospitals[index].id:updatedHospital.id,
      //     name: (!updatedHospital.name)?this.hospitals[index].name:updatedHospital.name,
      //     address: (!updatedHospital.address)?this.hospitals[index].address:updatedHospital.address,
      //     description: (!updatedHospital.description)?this.hospitals[index].description:updatedHospital.description,
      //     cghs_id: (!updatedHospital.cghs_id)?this.hospitals[index].cghs_id:updatedHospital.cghs_id
      //   };
      //   this.hospitals[index] = new Hospital(hospitalObj);
      //   this.subject$.next(this.hospitals);
      // }
    });
  }

  deleteHospital(hospital: Hospital) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    hospital.is_delete = 1;
    hospital.deleted_at = new Date();
    this.hospitalService.editHospital(hospital).subscribe(hp => {
      if(hp){
          this.hospitals.splice(this.hospitals.findIndex((existingHospital) => existingHospital.id === hospital.id), 1);
          this.selection.deselect(hospital);
          this.subject$.next(this.hospitals);
      }
    });
  }

  deleteHospitals(hospitals: Hospital[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    hospitals.forEach(c => this.deleteHospital(c));
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

  onLabelChange(change: MatSelectChange, row: Hospital) {
    const index = this.hospitals.findIndex(c => c === row);
    this.hospitals[index].labels = change.value;
    this.subject$.next(this.hospitals);
  }

  ngOnDestroy() {
  }
}

import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Comunication } from './interfaces/comunication.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../@vex/interfaces/table-column.interface';
import { ComunicationCreateUpdateComponent } from './comunication-create-update/comunication-create-update.component';
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

import { ComunicationService } from '../../../app/pages/services/comunication.service';

@Component({
  selector: 'vex-comunication',
  templateUrl: './comunication.component.html',
  styleUrls: ['./comunication.component.scss'],
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
export class ComunicationComponent implements OnInit, AfterViewInit, OnDestroy {

  layoutCtrl = new FormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<Comunication[]> = new ReplaySubject<Comunication[]>(1);
  data$: Observable<Comunication[]> = this.subject$.asObservable();
  comunications: Comunication[];

  @Input()
  columns: TableColumn<Comunication>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'remarks', property: 'remarks', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'your comments', property: 'cil_admin_comments', type: 'text', visible: true },
    { label: 'Comunicated on', property: 'created_at', type: 'text', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Comunication> | null;
  selection = new SelectionModel<Comunication>(true, []);
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

  constructor(private dialog: MatDialog, private comunicationService:ComunicationService) {
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */
  

  ngOnInit() {
    
    this.comunicationService.getAllComunications().subscribe(PD => {
      console.log(PD);
      this.comunications = PD["result"];
      this.subject$.next(this.comunications);   
    });

    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter<Comunication[]>(Boolean)
    ).subscribe(comunications => {
      this.comunications = comunications;
      this.dataSource.data = comunications;
    });

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }
 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createComunication() {
    this.dialog.open(ComunicationCreateUpdateComponent).afterClosed().subscribe((comunication: Comunication) => {
      /**
       * Comunication is the updated comunication (if the user pressed Save - otherwise it's null)
       */
      if (comunication) {
        /**
         * Here we are updating our local array.
         * You would probably make an HTTP request here.
         */
        this.comunications.unshift(new Comunication(comunication));
        this.subject$.next(this.comunications);
      }
    });
  }

  updateComunication(comunication: Comunication) {
    this.dialog.open(ComunicationCreateUpdateComponent, {
      data: comunication
    }).afterClosed().subscribe(updatedComunication => {
      /**
       * Comunication is the updated comunication (if the user pressed Save - otherwise it's null)
       */
      if (updatedComunication) {
        this.ngOnInit();
        // /**
        //  * Here we are updating our local array.
        //  * You would probably make an HTTP request here.
        //  */
        // const index = this.comunications.findIndex((existingComunication) => existingComunication.id === updatedComunication.id);
        
        // let comunicationObj = {
        //   id: (!updatedComunication.id)?this.comunications[index].id:updatedComunication.id,
        //   name: (!updatedComunication.remarks)?this.comunications[index].remarks:updatedComunication.remarks,
        //   address: (!updatedComunication.cil_admin_comments)?this.comunications[index].cil_admin_comments:updatedComunication.cil_admin_comments,
        //   };
        // this.comunications[index] = new Comunication(comunicationObj);
        // this.subject$.next(this.comunications);
      }
    });
  }

  deleteComunication(comunication: Comunication) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    // comunication.is_delete = 1;
    // comunication.deleted_at = new Date();
    this.comunicationService.editComunication(comunication).subscribe(hp => {
      if(hp){
          this.comunications.splice(this.comunications.findIndex((existingComunication) => existingComunication.id === comunication.id), 1);
          this.selection.deselect(comunication);
          this.subject$.next(this.comunications);
      }
    });
  }

  deleteComunications(comunications: Comunication[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    comunications.forEach(c => this.deleteComunication(c));
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

  onLabelChange(change: MatSelectChange, row: Comunication) {
    const index = this.comunications.findIndex(c => c === row);
    this.comunications[index].labels = change.value;
    this.subject$.next(this.comunications);
  }

  ngOnDestroy() {
  }
}

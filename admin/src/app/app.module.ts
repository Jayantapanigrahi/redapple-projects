import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VexModule } from '../@vex/vex.module';
import { HttpClientModule } from '@angular/common/http';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatRippleModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MatPaginatorModule } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule} from '@angular/material';
import { MatMenuModule} from '@angular/material/menu';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { CountdownTimerModule } from 'ngx-countdown-timer';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule,
  MatSidenavModule,
  MatCardModule,
  MatTableModule,
  MatSortModule,
  MatTabsModule,
  MatToolbarModule,
} from "@angular/material";
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AlertModule } from './_alert';
import {MatExpansionModule} from '@angular/material/expansion';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { AddressFormatPipe } from './pipes/address-format.pipe';
import { AmountFormatPipe } from './pipes/amount-format.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { ApplicationStatusPipe } from './pipes/application-status.pipe';
import { TruncatePipe }   from './pipes/truncate.pipe';
import {NgxPaginationModule} from 'ngx-pagination';

import { HomeComponent } from './web-portal/home/home.component';
import { HeaderComponent } from './web-portal/layout/header/header.component';
import { FooterComponent } from './web-portal/layout/footer/footer.component';
import { EmpanelledHospitalsComponent } from './web-portal/empanelled-hospitals/empanelled-hospitals.component';
import { DescriptionPopUp } from './web-portal/empanelled-hospitals/empanelled-hospitals.component';
import { WebLayoutComponent } from './web-portal/layout/layout.component';
import { ContactComponent } from './web-portal/contact/contact.component';
import { FaqComponent } from './web-portal/faq/faq.component';
import { GrievanceComponent } from './web-portal/grievance/grievance.component';
import { UserSignUpComponent } from './web-portal/sign-up/user-sign-up/user-sign-up.component';
import { UserLoginComponent } from './web-portal/user-login/user-login.component';
import { SignUpComponent } from './web-portal/sign-up/sign-up.component';
import { HospitalSignUpComponent } from './web-portal/sign-up/hospital-sign-up/hospital-sign-up.component';
import { HospitalDashboardComponent } from './web-portal/hospital/hospital-dashboard/hospital-dashboard.component';
import { HospitalComponent } from './web-portal/hospital/hospital.component';
import { EmployeeDashboardComponent } from './web-portal/employee/employee-dashboard/employee-dashboard.component';
import { EmployeeProfileComponent } from './web-portal/employee/employee-profile/employee-profile.component';
import { EmployeeComponent } from './web-portal/employee/employee.component';
import { HospitalEstimationSubmissionComponent } from './web-portal/hospital/hospital-estimation-submission/hospital-estimation-submission.component';
import { HospitalProfileComponent } from './web-portal/hospital/hospital-profile/hospital-profile.component';
import { DeUserComponent } from './web-portal/hospital/de-user/de-user.component';
import { DeUserCreateUpdateComponent } from './web-portal/hospital/de-user/de-user-create-update/de-user-create-update.component';
import { EmployeeOpdClaimComponent } from './web-portal/employee/employee-opd-claim/employee-opd-claim.component';
import { CilEmployeesComponent } from './web-portal/hospital/cil-employees/cil-employees.component';
import { EmployeeEstimationsComponent } from './web-portal/employee/employee-estimations/employee-estimations.component';
import { HospitalBillComponent } from './web-portal/hospital/hospital-bill/hospital-bill.component';
import { HospitalBillSubmissionComponent } from './web-portal/hospital/hospital-bill-submission/hospital-bill-submission.component';
import { EmployeeOpdClaimListComponent } from './web-portal/employee/employee-opd-claim-list/employee-opd-claim-list.component';
import { HospitalEstimationsComponent } from './web-portal/hospital/hospital-estimations/hospital-estimations.component';
import { HospitalApprovedBillsComponent } from './web-portal/hospital/hospital-approved-bills/hospital-approved-bills.component';
import { HospitalApprovedEstimationsComponent } from './web-portal/hospital/hospital-approved-estimations/hospital-approved-estimations.component';
import { EmployeeOdpDetailsComponent } from './web-portal/employee/employee-opd-claim-list/employee-odp-details/employee-odp-details.component';
import { CommunicationComponent } from './web-portal/hospital/communication/communication.component';
import { EmployeeLifeCertificateComponent } from './web-portal/employee/employee-life-certificate/employee-life-certificate.component';
import { MedprofileComponent } from './web-portal/hospital/medprofile/medprofile.component';
//import { ProvisionalDiagnosisComponent } from './pages/provisionalDiagnosisModule/provisionalDiagnosis.component';
@NgModule({
  declarations: [
   AppComponent,
   DateAgoPipe,
   TruncatePipe,
   ApplicationStatusPipe,
   AddressFormatPipe,
   AmountFormatPipe,
   DateFormatPipe,
   HomeComponent,
   HeaderComponent,
   FooterComponent,
   EmpanelledHospitalsComponent,
   WebLayoutComponent,
   ContactComponent,
   FaqComponent,
   DescriptionPopUp,
   GrievanceComponent,
   UserSignUpComponent,
   UserLoginComponent,
   SignUpComponent,
   HospitalSignUpComponent,
   HospitalDashboardComponent,
   EmployeeDashboardComponent,
   EmployeeProfileComponent,
   EmployeeComponent,
   HospitalEstimationSubmissionComponent,
   EmployeeOpdClaimComponent,
   EmployeeOpdClaimListComponent,
   HospitalComponent,
   HospitalProfileComponent,
   DeUserComponent,
   DeUserCreateUpdateComponent,
   CilEmployeesComponent,
   EmployeeEstimationsComponent,
   HospitalBillComponent,
   HospitalBillSubmissionComponent,
   HospitalEstimationsComponent,
   HospitalApprovedBillsComponent,
   HospitalApprovedEstimationsComponent,
   EmployeeOdpDetailsComponent,
   CommunicationComponent,
   EmployeeLifeCertificateComponent,
   MedprofileComponent,
   ],
   entryComponents: [
     DescriptionPopUp,
     DeUserCreateUpdateComponent,
     EmployeeOdpDetailsComponent,
   ],
  imports: [
    BrowserModule,
    PdfViewerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgbModule,
    MatRadioModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    MatListModule,
    MatToolbarModule,
    MatExpansionModule,
    AlertModule,
    MatAutocompleteModule,
    SelectAutocompleteModule,
    NgxMatSelectSearchModule,
    NgxPaginationModule,
    MatSnackBarModule,
    NgxMaterialTimepickerModule,
    CountdownTimerModule.forRoot(),
    // Vex
    VexModule
  ],
  providers: [
     MatDatepickerModule,
     DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

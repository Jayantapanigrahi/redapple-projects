import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../@vex/layout/layout.component';
import { VexRoutes } from '../@vex/interfaces/vex-route.interface';
import { HomeComponent } from './web-portal/home/home.component';
import { EmpanelledHospitalsComponent } from './web-portal/empanelled-hospitals/empanelled-hospitals.component';
import { WebLayoutComponent } from './web-portal/layout/layout.component';
import { ContactComponent } from './web-portal/contact/contact.component';
import { FaqComponent } from './web-portal/faq/faq.component';
import { GrievanceComponent } from './web-portal/grievance/grievance.component';
import { SignUpComponent } from './web-portal/sign-up/sign-up.component';
import { UserLoginComponent } from './web-portal/user-login/user-login.component';
import { HospitalDashboardComponent } from './web-portal/hospital/hospital-dashboard/hospital-dashboard.component';
import { EmployeeDashboardComponent } from './web-portal/employee/employee-dashboard/employee-dashboard.component';
import { EmployeeComponent } from './web-portal/employee/employee.component';
import { EmployeeProfileComponent } from './web-portal/employee/employee-profile/employee-profile.component';
import { HospitalComponent } from './web-portal/hospital/hospital.component';
import { HospitalEstimationSubmissionComponent } from './web-portal/hospital/hospital-estimation-submission/hospital-estimation-submission.component';
import { HospitalProfileComponent } from './web-portal/hospital/hospital-profile/hospital-profile.component';
import { DeUserComponent } from './web-portal/hospital/de-user/de-user.component';
import { EmployeeOpdClaimComponent } from './web-portal/employee/employee-opd-claim/employee-opd-claim.component';
import { CilEmployeesComponent } from './web-portal/hospital/cil-employees/cil-employees.component';
import { EmployeeEstimationsComponent } from './web-portal/employee/employee-estimations/employee-estimations.component';
import { HospitalBillComponent } from './web-portal/hospital/hospital-bill/hospital-bill.component';
import { HospitalBillSubmissionComponent } from './web-portal/hospital/hospital-bill-submission/hospital-bill-submission.component';
import { EmployeeOpdClaimListComponent } from './web-portal/employee/employee-opd-claim-list/employee-opd-claim-list.component';

import { AuthGuard } from '../app/pages/auth/auth.guard';
import { AuthGuardAdmin } from '../app/pages/auth/auth.guard.admin';
import { AuthGuardAccountDepartmentAdmin } from '../app/pages/auth/auth.guard.accounts-department-admin';
import { AuthGuardWelfareDepartmentAdmin } from '../app/pages/auth/auth.guard.welfare-department-admin';
import { AuthGuardMedicalDepartmentAdmin } from '../app/pages/auth/auth.guard.medical-department-admin';
import { AuthGuardMedicalDepartment } from '../app/pages/auth/auth.guard.medical-department';
import { AuthGuardAccountDepartment } from '../app/pages/auth/auth.guard.accounts-department';
import { AuthGuardWelfareDepartment } from '../app/pages/auth/auth.guard.welfare-department';
import { EmployeeAuthGuard } from './web-portal/auth/auth.guard.employee';
import { AuthGuardHospital } from './web-portal/auth/auth.guard.hospital';
import { AuthGuardHospitalAdmin } from './web-portal/auth/auth.guard.hospital-admin';
import { HospitalEstimationsComponent } from './web-portal/hospital/hospital-estimations/hospital-estimations.component';
import { HospitalApprovedBillsComponent } from './web-portal/hospital/hospital-approved-bills/hospital-approved-bills.component';
import { HospitalApprovedEstimationsComponent } from './web-portal/hospital/hospital-approved-estimations/hospital-approved-estimations.component';
import { CommunicationComponent } from './web-portal/hospital/communication/communication.component';
import { EmployeeLifeCertificateComponent } from './web-portal/employee/employee-life-certificate/employee-life-certificate.component';
import { MedprofileComponent } from './web-portal/hospital/medprofile/medprofile.component';

const childrenRoutes: VexRoutes = [
  {
    path: '',
    canActivate: [AuthGuard],
    redirectTo: 'dashboards/analytics',
    pathMatch: 'full',
  },
  {
    path: 'dashboards/analytics',
    loadChildren: () => import('./pages/dashboards/dashboard-analytics/dashboard-analytics.module').then(m => m.DashboardAnalyticsModule),
  },
  {
    path: 'pages/profile',
    loadChildren: () => import('./pages/pages/profile/profile.module').then(m => m.ProfileModule),
  },
  {
    path: 'bills/:type',
    canActivate: [AuthGuardAdmin],
    loadChildren: () => import('./pages/bills/bills.module').then(m => m.BILLSModule)
  },
  {
    path: 'employee/:type',
     canActivate: [AuthGuardAdmin],
    loadChildren: () => import('./pages/employee/employee.module').then(m => m.EmployeeModule)
  },
  {
    path: 'hospital',
    canActivate: [AuthGuardAdmin],
    loadChildren: () => import('./pages/hospital/hospital.module').then(m => m.HospitalModule)
  },
  {
    path: 'cghs',
    canActivate: [AuthGuardAdmin],
    loadChildren: () => import('./pages/cghs/cghs.module').then(m => m.CGHSModule)
  },
  // {
  //   path: 'provisional-diagnosis',
  //   canActivate: [AuthGuardAdmin],
  //   loadChildren: () => import('./pages/provisionalDiagnosisModule/provisionaldiagnosis.module').then(m => m.ProvisionalDiagnosisModule)
  // },
  {
    path: 'hospital-comunication',
    canActivate: [AuthGuardAdmin],
    loadChildren: () => import('./pages/comunication/comunication.module').then(m => m.ComunicationModule)
  },
  {
    path: 'roles-and-responsibility',
     canActivate: [AuthGuardAdmin],
    loadChildren: () => import('./pages/rolesandresponsibility/rolesandresponsibility.module').then(m => m.RolesAndResponsibilityModule)
  },
  {
    path: 'estimations/:type',
    canActivate: [AuthGuardAdmin],
    loadChildren: () => import('./pages/estimations/estimations.module').then(m => m.EstimationsModule)
  },
  //Route For Medical Department
  {
    path: 'medical-department/bills/:type',
     canActivate: [AuthGuardMedicalDepartment],
    loadChildren: () => import('./pages/bills/bills.module').then(m => m.BILLSModule)
  },
  {
     path: 'medical-department/estimations/:type',
     canActivate: [AuthGuardMedicalDepartment],
    loadChildren: () => import('./pages/estimations/estimations.module').then(m => m.EstimationsModule)
  },
  {
     path: 'medical-department/scrutiny',
     canActivate: [AuthGuardMedicalDepartment],
    loadChildren: () => import('./pages/estimations/estimations.module').then(m => m.EstimationsModule)
  },
  //Route For Welfare Department
  {
    path: 'welfare-department/employee/:type',
     canActivate: [AuthGuardWelfareDepartment],
    loadChildren: () => import('./pages/employee/employee.module').then(m => m.EmployeeModule)
  },
  //Route For Accounts Department
  {
     path: 'accounts-department/estimations/:type',
     canActivate: [AuthGuardAccountDepartmentAdmin],
    loadChildren: () => import('./pages/estimations/estimations.module').then(m => m.EstimationsModule)
  },
  {
     path: 'accounts-department/bills/:type',
     canActivate: [AuthGuardAccountDepartmentAdmin],
    loadChildren: () => import('./pages/bills/bills.module').then(m => m.BILLSModule)},
];
const routes: Routes = [
{
    path: '',
    children: [
  {
    path: 'Admin',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    children: childrenRoutes
  },
  {
    path: 'employee',
    canActivate: [EmployeeAuthGuard],
    component: WebLayoutComponent,
    children: [
                 {
                  path: '',
                  component: EmployeeComponent,
                   children: [
                   {
                    path: 'dashboard',
                    component: EmployeeDashboardComponent,
                    pathMatch: 'full',
                   },
                   {
                    path: 'profile',
                    component: EmployeeProfileComponent,
                    pathMatch: 'full',
                   },
                   {
                    path: 'estimations',
                    component: EmployeeEstimationsComponent,
                    pathMatch: 'full',
                   },
                   {
                    path: 'opd-claim',
                    component: EmployeeOpdClaimComponent,
                    pathMatch: 'full'
                   },
                   {
                     path: 'opd-claim-list',
                     component: EmployeeOpdClaimListComponent,
                     pathMatch: 'full'
                   },
                  {
                     path: 'life-certificate',
                     component: EmployeeLifeCertificateComponent,
                     pathMatch: 'full'
                   },
                  ]
                 },
               ]
  },
  {
    path: 'hospital',
    canActivate: [AuthGuardHospital],
    component: WebLayoutComponent,
    children: [
                 {
                  path: '',
                  component: HospitalComponent,
                  children: [
                   {
                    path: 'dashboard',
                    component: HospitalDashboardComponent,
                    pathMatch: 'full',
                   },
                   {
                    path: 'profile',
                    canActivate:[AuthGuardHospitalAdmin],
                    component: HospitalProfileComponent,
                    pathMatch: 'full',
                   },
                   {
                    path: 'de-users',
                    canActivate:[AuthGuardHospitalAdmin],
                    component: DeUserComponent,
                    pathMatch: 'full',
                   },
                   {
                    path: 'cil-employees',
                    //canActivate:[AuthGuardHospitalAdmin],
                    component: CilEmployeesComponent,
                    pathMatch: 'full',
                   },
                   {
                    path: 'hospital-estimation-submission',
                    component: HospitalEstimationSubmissionComponent,
                    pathMatch: 'full'
                   },
                   {
                    path: 'hospital-bill-submission',
                    component: HospitalBillSubmissionComponent,
                    pathMatch: 'full'
                   },
                   {
                    path: 'hospital-bill-list',
                    component: HospitalBillComponent,
                    pathMatch: 'full'
                   },
                   {
                    path: 'hospital-approved-bill-list',
                    canActivate:[AuthGuardHospitalAdmin],
                    component: HospitalApprovedBillsComponent,
                    pathMatch: 'full'
                   },
                   {
                    path: 'hospital-estimation-list',
                    component: HospitalEstimationsComponent,
                    pathMatch: 'full'
                   },
                   {
                    path: 'hospital-approved-estimation-list',
                    canActivate:[AuthGuardHospitalAdmin],
                    component: HospitalApprovedEstimationsComponent,
                    pathMatch: 'full'
                   },
                   {
                    path: 'hospital-comunication',
                    canActivate:[AuthGuardHospitalAdmin],
                    component: CommunicationComponent,
                    pathMatch: 'full'
                   },
                   { path: 'dishes/:dishId/ingredients/:ingredientId', 
                    component: MedprofileComponent }
                   ]
                 },
               ]
  },
  {
    path: '',
    component: WebLayoutComponent,
    canActivate:[],
       children: [
        {
          path: '',
          component: HomeComponent,
          pathMatch: 'full',
        },
        {
         path: 'empanelled-hospitals',
         component: EmpanelledHospitalsComponent,
         pathMatch: 'full'
        },
        { path: 'medprofile/:compId/:empId', 
          canActivate:[AuthGuardHospitalAdmin], 
          component: MedprofileComponent,
        },
        {
        path: 'contact',
        component: ContactComponent,
        pathMatch: 'full'
        },
        {
        path: 'faq',
        component: FaqComponent,
        pathMatch: 'full'
        },
        {
        path: 'grievance',
        component: GrievanceComponent,
        pathMatch: 'full'
        },
        {
        path: 'sign-up',
        component: SignUpComponent,
        pathMatch: 'full'
        },
        {
        path: 'login',
        component: UserLoginComponent,
        pathMatch: 'full'
        },

        ]
  },
  {
    path: 'Admin/login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
  },
  ]
}

];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

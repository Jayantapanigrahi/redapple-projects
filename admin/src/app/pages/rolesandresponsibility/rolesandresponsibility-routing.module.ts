import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from '../../../@vex/interfaces/vex-route.interface';
import { RolesAndResponsibilityComponent } from './rolesandresponsibility.component';


const routes: VexRoutes = [
  {
    path: '',
    component: RolesAndResponsibilityComponent,
    data: {
      toolbarShadowEnabled: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesAndResponsibilityRoutingModule {
}

import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ViewDataComponent } from './view-data/view-data.component';

export const routes: Routes = [
  { path: 'maintenance', component: MaintenanceComponent },
  { path: 'view', component: ViewDataComponent },
  { path: '', redirectTo: 'maintenance', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

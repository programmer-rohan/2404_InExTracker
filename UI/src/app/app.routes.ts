import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';

export const routes: Routes = [
  { path: 'maintenance', component: MaintenanceComponent },
  { path: '', redirectTo: 'maintenance', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

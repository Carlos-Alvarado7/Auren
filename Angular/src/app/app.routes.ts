import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';
import { PublicMenuComponent } from './features/public-menu/public-menu.component';
import { AdminLoginComponent } from './features/admin/admin-login.component';
import { AdminEditorComponent } from './features/admin/admin-editor.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'menu' },
  { path: 'menu', component: PublicMenuComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin', component: AdminEditorComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: 'menu' }
];


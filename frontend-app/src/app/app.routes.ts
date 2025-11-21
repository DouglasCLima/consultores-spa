// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ConsultorListComponent } from './pages/consultor-list/consultor-list.component';
import { ConsultorFormComponent } from './pages/consultor-form/consultor-form.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'consultores',
    component: ConsultorListComponent,
    canActivate: [authGuard] // Rota Protegida
  },
  {
    path: 'consultores/novo',
    component: ConsultorFormComponent,
    canActivate: [authGuard] // Rota Protegida (Criação)
  },
  {
    path: 'consultores/editar/:id',
    component: ConsultorFormComponent,
    canActivate: [authGuard] // Rota Protegida (Edição)
  },
  { path: '', redirectTo: '/consultores', pathMatch: 'full' },
  { path: '**', redirectTo: '/consultores' } // Rota coringa
];

// src/app/components/header/header.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/consultores">{{ title }}</a>
        <div class="d-flex">
          <ng-container *ngIf="authService.user$ | async as user">
            <span class="navbar-text me-3">Olá, {{ user.email }}</span>
            <button class="btn btn-warning" (click)="authService.logout()">Logout</button>
          </ng-container>
          <a *ngIf="!(authService.user$ | async)" routerLink="/login" class="btn btn-success">Login</a>
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  authService = inject(AuthService);
  title = 'Gestão de Consultores';
}

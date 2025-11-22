import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { AuthService } from './core/services';
import { inject } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, RouterOutlet],
  template: `
    @if (isAuthenticated()) {
      <app-main-layout />
    } @else {
      <router-outlet />
    }
  `,
  styleUrl: './app.css'
})
export class App {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated = this.authService.isAuthenticated;

  constructor() {
    // Écouter les changements de route pour forcer la redirection si déconnecté
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (!this.isAuthenticated() && !this.router.url.includes('/login')) {
        this.router.navigate(['/login']);
      }
    });
  }
}

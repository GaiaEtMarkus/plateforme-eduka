import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, NotificationService } from '../core/services';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-lg">
        <div class="flex flex-col h-full">
          <!-- Logo -->
          <div class="flex items-center justify-center h-20 border-b border-gray-200">
            <img src="/assets/logos/edukalogo.png" alt="Eduka" class="h-18" />
          </div>

          <!-- Navigation -->
          <nav class="flex-1 px-4 py-6 space-y-2">
            @if (isFormateur()) {
              <a routerLink="/calendar" routerLinkActive="bg-eduka-orange text-white"
                 class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Calendrier
              </a>

              <a routerLink="/propositions" routerLinkActive="bg-eduka-orange text-white"
                 class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Propositions
                @if (propositionsEnAttente() > 0) {
                  <span class="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {{ propositionsEnAttente() }}
                  </span>
                }
              </a>

              <a routerLink="/missions" routerLinkActive="bg-eduka-orange text-white"
                 class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Missions
              </a>

              <a routerLink="/invoices" routerLinkActive="bg-eduka-orange text-white"
                 class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
                Factures
              </a>

              <a routerLink="/history" routerLinkActive="bg-eduka-orange text-white"
                 class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Historique
              </a>

              <a routerLink="/contact" routerLinkActive="bg-eduka-orange text-white"
                 class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </a>
            }

            @if (isAdmin()) {
              <a routerLink="/admin/dashboard" routerLinkActive="bg-eduka-orange text-white"
                 class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
              </a>

              <a routerLink="/admin/trainers" routerLinkActive="bg-eduka-orange text-white"
                 class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Intervenants
              </a>

              <a routerLink="/admin/schools" routerLinkActive="bg-eduka-orange text-white"
                 class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Écoles
              </a>

              <a routerLink="/admin/proposals" routerLinkActive="bg-eduka-orange text-white"
                 class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Propositions
              </a>
            }
          </nav>

          <!-- User Profile -->
          <div class="border-t border-gray-200 p-4">
            <a routerLink="/profile" class="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <img [src]="currentUser()?.avatar || 'https://i.pravatar.cc/150'"
                   alt="Avatar" class="w-10 h-10 rounded-full" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ currentUser()?.prenom }} {{ currentUser()?.nom }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ currentUser()?.role }}
                </p>
              </div>
            </a>
            <button (click)="logout()"
                    class="w-full mt-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="bg-white shadow-sm">
          <div class="flex items-center justify-between h-16 px-6">
            <h1 class="text-xl font-semibold text-gray-800">
            </h1>

            <!-- Notifications -->
            <div class="flex items-center space-x-4">
              <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                @if (unreadNotifications() > 0) {
                  <span class="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {{ unreadNotifications() }}
                  </span>
                }
              </button>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto bg-gray-50 p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  isAdmin = this.authService.isAdmin;
  isFormateur = this.authService.isFormateur;
  unreadNotifications = this.notificationService.unreadCount;

  propositionsEnAttente = computed(() => {
    // TODO: Implémenter la logique de comptage
    return 3;
  });

  pageTitle = computed(() => {
    const url = this.router.url;
    if (url.includes('calendar')) return 'Calendrier';
    if (url.includes('propositions')) return 'Propositions';
    if (url.includes('missions')) return 'Missions';
    if (url.includes('invoices')) return 'Factures';
    if (url.includes('profile')) return 'Profil';
    if (url.includes('contact')) return 'Contact';
    if (url.includes('history')) return 'Historique';
    if (url.includes('admin/dashboard')) return 'Dashboard Admin';
    if (url.includes('admin/trainers')) return 'Gestion des Intervenants';
    if (url.includes('admin/schools')) return 'Gestion des Écoles';
    if (url.includes('admin/proposals')) return 'Gestion des Propositions';
    return 'Eduka';
  });

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

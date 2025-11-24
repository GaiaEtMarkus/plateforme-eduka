import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, NotificationService } from '../core/services';
import { Notification } from '../core/models';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  isAdmin = this.authService.isAdmin;
  isFormateur = this.authService.isFormateur;
  unreadNotifications = computed(() =>
    this.userNotifications().filter(n => !n.lu).length
  );

  // Notification signals
  showNotifications = signal<boolean>(false);
  private allNotifications = signal<Notification[]>([]);

  userNotifications = computed(() => {
    const userId = this.currentUser()?.id;
    if (!userId) return [];

    return this.allNotifications()
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  });

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

  ngOnInit(): void {
    // Subscribe to notifications
    this.notificationService.notifications$.subscribe({
      next: (notifications) => {
        this.allNotifications.set(notifications);
      },
      error: (err) => console.error('Erreur notifications', err)
    });
  }

  toggleNotifications(): void {
    this.showNotifications.update(v => !v);
  }

  closeNotifications(): void {
    this.showNotifications.set(false);
  }

  markAsRead(notificationId: string): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        // Update local state
        const updated = this.allNotifications().map(n =>
          n.id === notificationId ? { ...n, lu: true } : n
        );
        this.allNotifications.set(updated);
      },
      error: (err) => console.error('Erreur marquage notification', err)
    });
  }

  markAllAsRead(): void {
    const userId = this.currentUser()?.id;
    if (!userId) return;

    this.notificationService.markAllAsRead(userId).subscribe({
      next: () => {
        // Update local state
        const updated = this.allNotifications().map(n =>
          n.userId === userId ? { ...n, lu: true } : n
        );
        this.allNotifications.set(updated);
      },
      error: (err) => console.error('Erreur marquage toutes notifications', err)
    });
  }

  formatNotificationDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return 'À l\'instant';
    } else if (minutes < 60) {
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (hours < 24) {
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (days < 7) {
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

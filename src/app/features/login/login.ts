import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  error = signal('');
  loading = signal(false);

  // Liste des utilisateurs disponibles pour faciliter la connexion
  availableUsers = [
    { email: 'sophie.martin@email.com', role: 'Formateur', name: 'Sophie Martin' },
    { email: 'jean.dupont@email.com', role: 'Formateur', name: 'Jean Dupont' },
    { email: 'marie.bernard@email.com', role: 'Formateur', name: 'Marie Bernard' },
    { email: 'admin@eduka.fr', role: 'Administrateur', name: 'Admin Eduka' }
  ];

  login() {
    const emailValue = this.email();

    if (!emailValue) {
      this.error.set('Veuillez saisir un email');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.login(emailValue, 'password').subscribe({
      next: (user) => {
        this.loading.set(false);
        // Rediriger selon le rôle
        if (user.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/calendar']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Email non trouvé. Veuillez utiliser un email de la liste.');
      }
    });
  }

  quickLogin(email: string) {
    this.email.set(email);
    this.login();
  }

  updateEmail(value: string) {
    this.email.set(value);
    if (this.error()) {
      this.error.set('');
    }
  }
}

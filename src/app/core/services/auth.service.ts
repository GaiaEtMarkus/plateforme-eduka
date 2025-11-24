import { Injectable, signal, computed } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, UserRole } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signals pour la gestion de l'état
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  // Computed signals
  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  isAdmin = computed(() => this.currentUserSignal()?.role === UserRole.ADMIN);
  isFormateur = computed(() => this.currentUserSignal()?.role === UserRole.FORMATEUR);

  constructor() {
    // Charger l'utilisateur depuis le localStorage au démarrage
    this.loadUserFromStorage();
  }

  /**
   * Connexion de l'utilisateur (simulation)
   */
  login(email: string, password: string): Observable<User> {
    // Simulation d'un appel API
    return new Observable<User>(observer => {
      // Charger les utilisateurs mockés
      fetch('assets/data/users.json')
        .then(res => res.json())
        .then((users: User[]) => {
          const user = users.find(u => u.email === email);

          if (user) {
            // Stocker l'utilisateur
            this.setCurrentUser(user);
            observer.next(user);
            observer.complete();
          } else {
            observer.error(new Error('Email ou mot de passe incorrect'));
          }
        })
        .catch(err => observer.error(err));
    }).pipe(delay(500)); // Simulation de latence réseau
  }

  /**
   * Déconnexion
   */
  logout(): void {
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    localStorage.removeItem('currentUser');
  }

  /**
   * Définir l'utilisateur actuel
   */
  private setCurrentUser(user: User): void {
    this.currentUserSignal.set(user);
    this.isAuthenticatedSignal.set(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Charger l'utilisateur depuis le localStorage
   */
  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
      } catch (e) {
        console.error('Erreur lors du chargement de l\'utilisateur', e);
        localStorage.removeItem('currentUser');
      }
    }
  }

  /**
   * Auto-login pour le développement (à retirer en production)
   */
  autoLogin(userId: string = 'user-1'): Observable<User> {
    return new Observable<User>(observer => {
      fetch('assets/data/users.json')
        .then(res => res.json())
        .then((users: User[]) => {
          const user = users.find(u => u.id === userId);
          if (user) {
            this.setCurrentUser(user);
            observer.next(user);
            observer.complete();
          } else {
            observer.error(new Error('Utilisateur non trouvé'));
          }
        })
        .catch(err => observer.error(err));
    });
  }
}

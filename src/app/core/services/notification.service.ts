import { Injectable, signal, computed } from '@angular/core';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Notification, TypeNotification } from '../models';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);

  notifications$ = this.notificationsSubject.asObservable();

  // Signals
  private notificationsSignal = signal<Notification[]>([]);
  unreadCount = computed(() =>
    this.notificationsSignal().filter(n => !n.lu).length
  );

  constructor(private dataService: DataService) {
    this.loadNotifications();
    this.startPolling();
  }

  /**
   * Charge les notifications
   */
  private loadNotifications(): void {
    this.dataService.loadJsonData<any[]>('notifications').subscribe({
      next: (notifications) => {
        const enrichedNotifications = notifications.map(n => ({
          ...n,
          createdAt: new Date(n.createdAt)
        }));
        this.notificationsSubject.next(enrichedNotifications as Notification[]);
        this.notificationsSignal.set(enrichedNotifications as Notification[]);
      }
    });
  }

  /**
   * Polling pour simuler les notifications en temps réel
   */
  private startPolling(): void {
    // Vérifier les nouvelles notifications toutes les 30 secondes
    interval(30000).pipe(
      startWith(0)
    ).subscribe(() => {
      // En production, ceci serait un appel API réel
      // this.loadNotifications();
    });
  }

  /**
   * Récupère les notifications d'un utilisateur
   */
  getNotificationsByUser(userId: string): Observable<Notification[]> {
    return this.notifications$.pipe(
      map(notifs => notifs
        .filter(n => n.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      )
    );
  }

  /**
   * Marquer une notification comme lue
   */
  markAsRead(notificationId: string): Observable<any> {
    return new Observable(observer => {
      const notifications = this.notificationsSubject.value;
      const notification = notifications.find(n => n.id === notificationId);

      if (notification) {
        notification.lu = true;
        this.notificationsSubject.next([...notifications]);
        this.notificationsSignal.set([...notifications]);
      }

      observer.next({ success: true });
      observer.complete();
    });
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  markAllAsRead(userId: string): Observable<any> {
    return new Observable(observer => {
      const notifications = this.notificationsSubject.value;
      notifications.forEach(n => {
        if (n.userId === userId) {
          n.lu = true;
        }
      });

      this.notificationsSubject.next([...notifications]);
      this.notificationsSignal.set([...notifications]);

      observer.next({ success: true });
      observer.complete();
    });
  }

  /**
   * Créer une nouvelle notification
   */
  createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Observable<Notification> {
    return new Observable(observer => {
      const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}`,
        createdAt: new Date()
      };

      const notifications = this.notificationsSubject.value;
      this.notificationsSubject.next([newNotification, ...notifications]);
      this.notificationsSignal.set([newNotification, ...notifications]);

      observer.next(newNotification);
      observer.complete();
    });
  }

  /**
   * Supprimer une notification
   */
  deleteNotification(notificationId: string): Observable<any> {
    return new Observable(observer => {
      const notifications = this.notificationsSubject.value.filter(
        n => n.id !== notificationId
      );

      this.notificationsSubject.next(notifications);
      this.notificationsSignal.set(notifications);

      observer.next({ success: true });
      observer.complete();
    });
  }

  /**
   * Envoyer une notification à un utilisateur (Admin)
   */
  sendNotificationToUser(
    userId: string,
    titre: string,
    message: string,
    type: TypeNotification = TypeNotification.MESSAGE_ADMIN,
    lien?: string
  ): Observable<Notification> {
    return this.createNotification({
      userId,
      type,
      titre,
      message,
      lien,
      lu: false
    });
  }
}

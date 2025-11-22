import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then(m => m.Login)
  },
  {
    path: 'calendar',
    loadComponent: () => import('./features/calendar/calendar.component').then(m => m.CalendarComponent),
    canActivate: [authGuard]
  },
  {
    path: 'propositions',
    loadComponent: () => import('./features/propositions/propositions').then(m => m.Propositions),
    canActivate: [authGuard]
  },
  {
    path: 'missions',
    loadComponent: () => import('./features/missions/missions').then(m => m.Missions),
    canActivate: [authGuard]
  },
  {
    path: 'invoices',
    loadComponent: () => import('./features/invoices/invoices').then(m => m.Invoices),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile').then(m => m.Profile),
    canActivate: [authGuard]
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact').then(m => m.Contact),
    canActivate: [authGuard]
  },
  {
    path: 'history',
    loadComponent: () => import('./features/history/history').then(m => m.History),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin').then(m => m.Admin),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'trainers',
        loadComponent: () => import('./features/admin/trainers/trainers').then(m => m.Trainers)
      },
      {
        path: 'schools',
        loadComponent: () => import('./features/admin/schools/schools').then(m => m.Schools)
      },
      {
        path: 'proposals',
        loadComponent: () => import('./features/admin/proposals/proposals').then(m => m.Proposals)
      },
      {
        path: 'missions',
        loadComponent: () => import('./features/admin/missions-admin/missions-admin').then(m => m.MissionsAdmin)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

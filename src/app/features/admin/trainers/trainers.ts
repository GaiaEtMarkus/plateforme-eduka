import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionService } from '../../../core/services/mission.service';
import { DataService } from '../../../core/services/data.service';
import { Mission, User, Ecole, Cours } from '../../../core/models';

interface TrainerStats {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  avatar?: string;
  competences: { id: string; nom: string; niveau: string; }[];
  totalMissions: number;
  missionsEnCours: number;
  missionsTerminees: number;
  hoursThisMonth: number;
  totalRevenue: number;
  tauxReussite: number;
}

@Component({
  selector: 'app-trainers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trainers.html',
  styleUrl: './trainers.css',
})
export class Trainers implements OnInit {
  private missionService = inject(MissionService);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);

  missions = signal<Mission[]>([]);
  formateurs = signal<User[]>([]);
  ecoles = signal<Ecole[]>([]);
  cours = signal<Cours[]>([]);

  selectedTrainer = signal<TrainerStats | null>(null);
  trainerMissions = signal<Mission[]>([]);

  // Statistiques des formateurs
  trainerStats = computed(() => {
    const missions = this.missions();
    const formateurs = this.formateurs();

    return formateurs.map(formateur => {
      const formateurMissions = missions.filter(m => m.formateurId === formateur.id);
      const missionsTerminees = formateurMissions.filter(m => m.statut === 'terminee');
      const missionsEnCours = formateurMissions.filter(m => m.statut === 'en_cours');

      // Calculer les heures ce mois
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const missionsThisMonth = formateurMissions.filter(m => {
        const date = new Date(m.dateDebut);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      const hoursThisMonth = missionsThisMonth.reduce((sum, m) => {
        const debut = new Date(`2000-01-01 ${m.heureDebut}`);
        const fin = new Date(`2000-01-01 ${m.heureFin}`);
        const hours = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
        return sum + hours;
      }, 0);

      // Calculer le revenu total (estimation à 80€/heure)
      const totalHours = formateurMissions.reduce((sum, m) => {
        const debut = new Date(`2000-01-01 ${m.heureDebut}`);
        const fin = new Date(`2000-01-01 ${m.heureFin}`);
        const hours = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
        return sum + hours;
      }, 0);
      const totalRevenue = totalHours * 80;

      // Taux de réussite (missions terminées / total)
      const tauxReussite = formateurMissions.length > 0
        ? (missionsTerminees.length / formateurMissions.length) * 100
        : 0;

      return {
        id: formateur.id,
        nom: formateur.nom,
        prenom: formateur.prenom,
        email: formateur.email,
        telephone: formateur.telephone,
        avatar: formateur.avatar,
        competences: formateur.competences || [],
        totalMissions: formateurMissions.length,
        missionsEnCours: missionsEnCours.length,
        missionsTerminees: missionsTerminees.length,
        hoursThisMonth,
        totalRevenue,
        tauxReussite
      };
    });
  });

  // Top formateurs par nombre de missions
  topTrainers = computed(() => {
    return this.trainerStats()
      .sort((a, b) => b.totalMissions - a.totalMissions)
      .slice(0, 3);
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Charger les missions
    this.missionService.missions$.subscribe({
      next: (missions: Mission[]) => {
        this.missions.set(missions);
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error('Erreur missions', err)
    });

    // Charger les formateurs
    this.dataService.loadJsonData<User[]>('users').subscribe({
      next: (users: User[]) => {
        const formateurs = users.filter(u => u.role === 'formateur');
        this.formateurs.set(formateurs);
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error('Erreur users', err)
    });

    // Charger les écoles
    this.dataService.loadJsonData<Ecole[]>('ecoles').subscribe({
      next: (ecoles: Ecole[]) => {
        this.ecoles.set(ecoles);
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error('Erreur ecoles', err)
    });

    // Charger les cours
    this.dataService.loadJsonData<Cours[]>('cours').subscribe({
      next: (cours: Cours[]) => {
        this.cours.set(cours);
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error('Erreur cours', err)
    });
  }

  viewTrainerDetails(trainer: TrainerStats) {
    this.selectedTrainer.set(trainer);
    const missions = this.missions().filter(m => m.formateurId === trainer.id);
    this.trainerMissions.set(missions);
  }

  closeTrainerDetails() {
    this.selectedTrainer.set(null);
    this.trainerMissions.set([]);
  }

  getStatutColor(statut: string): string {
    switch (statut) {
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'terminee': return 'bg-green-100 text-green-800';
      case 'planifiee': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getSchoolLogo(ecoleId: string): string {
    const ecole = this.ecoles().find(e => e.id === ecoleId);
    if (ecole?.logo) {
      // Si le logo commence déjà par /, on l'utilise tel quel (en enlevant le /)
      // Sinon on ajoute le préfixe assets/logos/
      return ecole.logo.startsWith('/') ? ecole.logo.substring(1) : `assets/logos/${ecole.logo}`;
    }
    // Return random logo from available ones
    const logos = ['eni.png', 'epitech.png', 'esgi.png', 'estiam.png', 'isitech.png', 'ynov.png', 'supdevinci.jpeg'];
    const randomLogo = logos[Math.floor(Math.random() * logos.length)];
    return `assets/logos/${randomLogo}`;
  }

  getTrainerAvatar(): string | undefined {
    return this.selectedTrainer()?.avatar;
  }
}

import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionService } from '../../../core/services/mission.service';
import { DataService } from '../../../core/services/data.service';
import { Mission, Ecole, Classe, Cours, User } from '../../../core/models';

interface SchoolStats {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  telephone: string;
  email: string;
  totalMissions: number;
  missionsEnCours: number;
  missionsTerminees: number;
  formateursUniques: number;
  coursUniques: number;
}

@Component({
  selector: 'app-schools',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schools.html',
  styleUrl: './schools.css',
})
export class Schools implements OnInit {
  private missionService = inject(MissionService);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);

  missions = signal<Mission[]>([]);
  ecoles = signal<Ecole[]>([]);
  classes = signal<Classe[]>([]);
  cours = signal<Cours[]>([]);
  formateurs = signal<User[]>([]);

  selectedSchool = signal<SchoolStats | null>(null);
  schoolMissions = signal<Mission[]>([]);

  // Statistiques des écoles
  schoolStats = computed(() => {
    const missions = this.missions();
    const ecoles = this.ecoles();

    return ecoles.map(ecole => {
      const ecoleMissions = missions.filter(m => m.ecole.id === ecole.id);
      const missionsEnCours = ecoleMissions.filter(m => m.statut === 'en_cours');
      const missionsTerminees = ecoleMissions.filter(m => m.statut === 'terminee');

      // Formateurs uniques
      const formateursUniques = new Set(ecoleMissions.map(m => m.formateurId)).size;

      // Cours uniques
      const coursUniques = new Set(ecoleMissions.map(m => m.cours.id)).size;

      return {
        id: ecole.id,
        nom: ecole.nom,
        adresse: ecole.adresse,
        ville: ecole.ville,
        codePostal: ecole.codePostal,
        telephone: ecole.telephone,
        email: ecole.email,
        totalMissions: ecoleMissions.length,
        missionsEnCours: missionsEnCours.length,
        missionsTerminees: missionsTerminees.length,
        formateursUniques,
        coursUniques
      };
    });
  });

  // Top écoles par nombre de missions
  topSchools = computed(() => {
    return this.schoolStats()
      .sort((a, b) => b.totalMissions - a.totalMissions)
      .slice(0, 3);
  });

  // Statistiques globales
  globalStats = computed(() => {
    const stats = this.schoolStats();
    return {
      totalEcoles: stats.length,
      totalMissions: stats.reduce((sum, s) => sum + s.totalMissions, 0),
      missionsEnCours: stats.reduce((sum, s) => sum + s.missionsEnCours, 0),
      missionsTerminees: stats.reduce((sum, s) => sum + s.missionsTerminees, 0)
    };
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

    // Charger les écoles
    this.dataService.loadJsonData<Ecole[]>('ecoles').subscribe({
      next: (ecoles: Ecole[]) => {
        this.ecoles.set(ecoles);
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error('Erreur ecoles', err)
    });

    // Charger les classes
    this.dataService.loadJsonData<Classe[]>('classes').subscribe({
      next: (classes: Classe[]) => {
        this.classes.set(classes);
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error('Erreur classes', err)
    });

    // Charger les cours
    this.dataService.loadJsonData<Cours[]>('cours').subscribe({
      next: (cours: Cours[]) => {
        this.cours.set(cours);
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error('Erreur cours', err)
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
  }

  viewSchoolDetails(school: SchoolStats) {
    this.selectedSchool.set(school);
    const missions = this.missions().filter(m => m.ecole.id === school.id);
    this.schoolMissions.set(missions);
  }

  closeSchoolDetails() {
    this.selectedSchool.set(null);
    this.schoolMissions.set([]);
  }

  getFormateurName(formateurId: string): string {
    const formateur = this.formateurs().find(f => f.id === formateurId);
    return formateur ? `${formateur.prenom} ${formateur.nom}` : formateurId;
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
}

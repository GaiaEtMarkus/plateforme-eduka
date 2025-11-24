import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissionService } from '../../../core/services/mission.service';
import { DataService } from '../../../core/services/data.service';
import { Mission, User, Ecole, Cours, TypeAlerteIntervenant, AlerteIntervenant } from '../../../core/models';

interface TrainerStats {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  avatar?: string;
  alertes?: AlerteIntervenant[];
  competences: { id: string; nom: string; niveau: 'debutant' | 'intermediaire' | 'expert'; }[];
  documents?: { id: string; nom: string; type: 'cv' | 'diplome' | 'kbis' | 'autre'; url: string; uploadedAt: Date; }[];
  disponibilites?: { jour: string; heureDebut: string; heureFin: string; }[];
  adresse?: string;
  ville?: string;
  codePostal?: string;
  tarifHoraire?: number;
  noteGlobale?: number;
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
  imports: [CommonModule, FormsModule],
  templateUrl: './trainers.html',
  styleUrl: './trainers.css',
})
export class Trainers implements OnInit {
  private missionService = inject(MissionService);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);

  // Expose enum
  readonly TypeAlerteIntervenant = TypeAlerteIntervenant;

  missions = signal<Mission[]>([]);
  formateurs = signal<User[]>([]);
  ecoles = signal<Ecole[]>([]);
  cours = signal<Cours[]>([]);

  selectedTrainer = signal<TrainerStats | null>(null);
  trainerMissions = signal<Mission[]>([]);
  showAlerteModal = signal<boolean>(false);

  // Formulaire alerte intervenant
  newAlerteIntervenant = signal<{
    type: TypeAlerteIntervenant;
    titre: string;
    description: string;
  }>({
    type: TypeAlerteIntervenant.AUTRE,
    titre: '',
    description: ''
  });

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
        if (!m.dateDebut) return false;
        return m.dateDebut.getMonth() === currentMonth && m.dateDebut.getFullYear() === currentYear;
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
        alertes: formateur.alertes || [],
        competences: formateur.competences || [],
        documents: formateur.documents || [],
        disponibilites: formateur.disponibilites || [],
        adresse: formateur.adresse,
        ville: formateur.ville,
        codePostal: formateur.codePostal,
        tarifHoraire: formateur.tarifHoraire,
        noteGlobale: formateur.noteGlobale,
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

  openAlerteModal(trainer: TrainerStats) {
    this.selectedTrainer.set(trainer);
    const missions = this.missions().filter(m => m.formateurId === trainer.id);
    this.trainerMissions.set(missions);
    this.showAlerteModal.set(true);
    this.newAlerteIntervenant.set({
      type: TypeAlerteIntervenant.AUTRE,
      titre: '',
      description: ''
    });
  }

  closeAlerteModal() {
    this.showAlerteModal.set(false);
    this.newAlerteIntervenant.set({
      type: TypeAlerteIntervenant.AUTRE,
      titre: '',
      description: ''
    });
  }

  createAlerteIntervenant() {
    const trainer = this.selectedTrainer();
    const alerteData = this.newAlerteIntervenant();

    if (!trainer || !alerteData.titre || !alerteData.description) {
      return;
    }

    const newAlerte: AlerteIntervenant = {
      id: `alerte-int-${Date.now()}`,
      type: alerteData.type,
      titre: alerteData.titre,
      description: alerteData.description,
      createdAt: new Date(),
      createdBy: 'admin-1', // TODO: Récupérer l'ID de l'admin connecté
      resolue: false
    };

    // Mettre à jour le formateur avec la nouvelle alerte
    const updatedFormateurs = this.formateurs().map(f => {
      if (f.id === trainer.id) {
        const updatedFormateur = {
          ...f,
          alertes: [...(f.alertes || []), newAlerte]
        };
        // Mettre à jour aussi le trainer sélectionné
        const updatedTrainerStats = this.trainerStats().find(t => t.id === trainer.id);
        if (updatedTrainerStats) {
          this.selectedTrainer.set({
            ...updatedTrainerStats,
            alertes: [...(updatedTrainerStats.alertes || []), newAlerte]
          });
        }
        return updatedFormateur;
      }
      return f;
    });

    this.formateurs.set(updatedFormateurs);
    this.closeAlerteModal();
    this.cdr.markForCheck();

    // TODO: Persister dans le backend
    console.log('Alerte intervenant créée:', newAlerte);
  }

  resolveAlerteIntervenant(trainer: TrainerStats, alerteId: string) {
    const updatedFormateurs = this.formateurs().map(f => {
      if (f.id === trainer.id) {
        const updatedFormateur = {
          ...f,
          alertes: f.alertes?.map(a =>
            a.id === alerteId
              ? { ...a, resolue: true, resolvedAt: new Date(), resolvedBy: 'admin-1' }
              : a
          )
        };
        // Mettre à jour aussi le trainer sélectionné si c'est le même
        if (this.selectedTrainer()?.id === trainer.id) {
          this.selectedTrainer.set({
            ...trainer,
            alertes: updatedFormateur.alertes
          });
        }
        return updatedFormateur;
      }
      return f;
    });

    this.formateurs.set(updatedFormateurs);
    this.cdr.markForCheck();

    // TODO: Persister dans le backend
    console.log('Alerte intervenant résolue:', alerteId);
  }

  hasActiveAlertes(trainer: TrainerStats): boolean {
    return (trainer.alertes?.filter(a => !a.resolue).length || 0) > 0;
  }

  getActiveAlertesCount(trainer: TrainerStats): number {
    return trainer.alertes?.filter(a => !a.resolue).length || 0;
  }

  getAlerteIntervenantColor(type: TypeAlerteIntervenant): string {
    switch (type) {
      case TypeAlerteIntervenant.ABSENCE_RECURRENTE:
      case TypeAlerteIntervenant.EVALUATION_NEGATIVE:
      case TypeAlerteIntervenant.PROBLEME_COMPORTEMENT:
        return 'bg-red-100 text-red-800';
      case TypeAlerteIntervenant.RETARD_FREQUENT:
        return 'bg-orange-100 text-orange-800';
      case TypeAlerteIntervenant.DISPONIBILITE:
      case TypeAlerteIntervenant.DOCUMENT_MANQUANT:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getAlerteIntervenantLabel(type: TypeAlerteIntervenant): string {
    switch (type) {
      case TypeAlerteIntervenant.ABSENCE_RECURRENTE:
        return 'Absence récurrente';
      case TypeAlerteIntervenant.RETARD_FREQUENT:
        return 'Retard fréquent';
      case TypeAlerteIntervenant.EVALUATION_NEGATIVE:
        return 'Évaluation négative';
      case TypeAlerteIntervenant.PROBLEME_COMPORTEMENT:
        return 'Problème comportement';
      case TypeAlerteIntervenant.DISPONIBILITE:
        return 'Disponibilité';
      case TypeAlerteIntervenant.DOCUMENT_MANQUANT:
        return 'Document manquant';
      default:
        return 'Autre';
    }
  }

  updateAlerteType(value: string) {
    const current = this.newAlerteIntervenant();
    this.newAlerteIntervenant.set({
      type: value as TypeAlerteIntervenant,
      titre: current.titre,
      description: current.description
    });
  }

  updateAlerteTitre(value: string) {
    const current = this.newAlerteIntervenant();
    this.newAlerteIntervenant.set({
      type: current.type,
      titre: value,
      description: current.description
    });
  }

  updateAlerteDescription(value: string) {
    const current = this.newAlerteIntervenant();
    this.newAlerteIntervenant.set({
      type: current.type,
      titre: current.titre,
      description: value
    });
  }
}

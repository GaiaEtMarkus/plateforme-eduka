import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionService } from '../../core/services/mission.service';
import { Mission } from '../../core/models';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History implements OnInit {
  private missionService = inject(MissionService);
  private cdr = inject(ChangeDetectorRef);

  missions = signal<Mission[]>([]);
  selectedYear = signal<number>(new Date().getFullYear());

  // Missions terminées uniquement
  completedMissions = computed(() => {
    return this.missions().filter(m => m.statut === 'terminee');
  });

  // Missions filtrées par année
  filteredMissions = computed(() => {
    const year = this.selectedYear();
    return this.completedMissions().filter(m => {
      if (!m.dateDebut) return false;
      const missionYear = m.dateDebut.getFullYear();
      return year === 0 || missionYear === year;
    });
  });

  // Années disponibles
  availableYears = computed(() => {
    const years = new Set<number>();
    this.completedMissions().forEach(m => {
      if (m.dateDebut) {
        years.add(m.dateDebut.getFullYear());
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  });

  // Statistiques
  stats = computed(() => {
    const missions = this.filteredMissions();
    const totalHeures = missions.reduce((sum, m) => {
      const debut = new Date(`2000-01-01 ${m.heureDebut}`);
      const fin = new Date(`2000-01-01 ${m.heureFin}`);
      const heures = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
      return sum + heures;
    }, 0);

    const ecolesUniques = new Set(missions.map(m => m.ecole.id)).size;

    return {
      totalMissions: missions.length,
      totalHeures: totalHeures,
      totalEcoles: ecolesUniques,
      moisActif: this.getMostActiveMonth(missions)
    };
  });

  ngOnInit() {
    this.loadMissions();
  }

  loadMissions() {
    this.missionService.missions$.subscribe({
      next: (missions: Mission[]) => {
        this.missions.set(missions);
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error('Erreur chargement missions', err)
    });
  }

  setYear(year: number) {
    this.selectedYear.set(year);
  }

  getMostActiveMonth(missions: Mission[]): string {
    if (missions.length === 0) return 'N/A';

    const monthCounts = new Map<number, number>();
    missions.forEach(m => {
      if (m.dateDebut) {
        const month = m.dateDebut.getMonth();
        monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
      }
    });

    let maxMonth = 0;
    let maxCount = 0;
    monthCounts.forEach((count, month) => {
      if (count > maxCount) {
        maxCount = count;
        maxMonth = month;
      }
    });

    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return monthNames[maxMonth];
  }

  getMonthYear(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
  }

  getDuration(mission: Mission): number {
    const debut = new Date(`2000-01-01 ${mission.heureDebut}`);
    const fin = new Date(`2000-01-01 ${mission.heureFin}`);
    return (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
  }

  getSchoolLogo(ecole: any): string {
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

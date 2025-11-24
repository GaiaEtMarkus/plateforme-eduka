import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FactureService } from '../../core/services/facture.service';
import { MissionService } from '../../core/services/mission.service';
import { AuthService } from '../../core/services/auth.service';
import { Facture, StatutFacture, Mission, StatutMission } from '../../core/models';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css',
})
export class Invoices implements OnInit {
  private factureService = inject(FactureService);
  private missionService = inject(MissionService);
  private authService = inject(AuthService);

  // Expose enum pour le template
  readonly StatutFacture = StatutFacture;

  factures = signal<Facture[]>([]);
  missions = signal<Mission[]>([]);
  selectedFacture = signal<Facture | null>(null);
  selectedFilter = signal<'all' | StatutFacture>('all');

  // Modals
  showUploadModal = signal<boolean>(false);
  showGenerateModal = signal<boolean>(false);
  uploadedFile = signal<File | null>(null);

  filteredFactures = computed(() => {
    const filter = this.selectedFilter();
    const factures = this.factures();

    if (filter === 'all') {
      return factures;
    }

    return factures.filter(f => f.statut === filter);
  });

  // Missions terminées sans facture
  missionsWithoutInvoice = computed(() => {
    const missions = this.missions();
    const factures = this.factures();
    const facturedMissionIds = new Set(
      factures.flatMap(f => f.lignes.map(l => l.missionId).filter(Boolean))
    );

    return missions.filter(m =>
      m.statut === StatutMission.TERMINEE &&
      !facturedMissionIds.has(m.id)
    );
  });

  // Statistiques
  stats = computed(() => {
    const factures = this.factures();
    return {
      totalFactures: factures.length,
      totalMontant: factures.reduce((sum, f) => sum + f.total, 0),
      soumises: factures.filter(f => f.statut === StatutFacture.SOUMISE).length,
      validees: factures.filter(f => f.statut === StatutFacture.VALIDEE).length,
      payees: factures.filter(f => f.statut === StatutFacture.PAYEE).length,
      missionsWithoutInvoice: this.missionsWithoutInvoice().length,
    };
  });

  ngOnInit() {
    this.loadFactures();
    this.loadMissions();
  }

  loadFactures() {
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.factureService.getFacturesByFormateur(userId).subscribe({
        next: (factures: Facture[]) => this.factures.set(factures),
        error: (err: any) => console.error('Erreur chargement factures', err)
      });
    }
  }

  loadMissions() {
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.missionService.missions$.subscribe({
        next: (missions: Mission[]) => {
          const userMissions = missions.filter(m => m.formateurId === userId);
          this.missions.set(userMissions);
        },
        error: (err: any) => console.error('Erreur chargement missions', err)
      });
    }
  }

  setFilter(filter: 'all' | StatutFacture) {
    this.selectedFilter.set(filter);
  }

  selectFacture(facture: Facture) {
    this.selectedFacture.set(facture);
  }

  closeSidebar() {
    this.selectedFacture.set(null);
  }

  genererPDF(facture: Facture) {
    this.factureService.genererPDF(facture);
  }

  soumettre(factureId: string) {
    this.factureService.soumettreFacture(factureId).subscribe({
      next: () => {
        alert('Facture soumise avec succès !');
        this.loadFactures();
      },
      error: (err: any) => console.error('Erreur soumission facture', err)
    });
  }

  getStatutColor(statut: StatutFacture): string {
    switch (statut) {
      case StatutFacture.BROUILLON:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case StatutFacture.SOUMISE:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case StatutFacture.VALIDEE:
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case StatutFacture.PAYEE:
        return 'bg-green-100 text-green-800 border-green-300';
      case StatutFacture.REFUSEE:
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  getStatutLabel(statut: StatutFacture): string {
    switch (statut) {
      case StatutFacture.BROUILLON:
        return 'Brouillon';
      case StatutFacture.SOUMISE:
        return 'Soumise';
      case StatutFacture.VALIDEE:
        return 'Validée';
      case StatutFacture.PAYEE:
        return 'Payée';
      case StatutFacture.REFUSEE:
        return 'Refusée';
      default:
        return statut;
    }
  }

  getFilterCount(filter: 'all' | StatutFacture): number {
    if (filter === 'all') {
      return this.factures().length;
    }
    return this.factures().filter(f => f.statut === filter).length;
  }

  isOverdue(facture: Facture): boolean {
    if (!facture.dateEcheance) return false;
    return new Date(facture.dateEcheance) < new Date() &&
           facture.statut !== StatutFacture.PAYEE;
  }

  // Modal upload facture
  openUploadModal() {
    this.showUploadModal.set(true);
    this.uploadedFile.set(null);
  }

  closeUploadModal() {
    this.showUploadModal.set(false);
    this.uploadedFile.set(null);
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.uploadedFile.set(target.files[0]);
    }
  }

  uploadFacture() {
    const file = this.uploadedFile();
    if (!file) return;

    // TODO: Implémenter l'upload vers le backend
    console.log('Upload de la facture:', file.name);
    alert(`Facture "${file.name}" uploadée avec succès! (Fonctionnalité à implémenter côté backend)`);
    this.closeUploadModal();
    this.loadFactures();
  }

  // Modal génération auto
  openGenerateModal() {
    this.showGenerateModal.set(true);
  }

  closeGenerateModal() {
    this.showGenerateModal.set(false);
  }

  generateFactureFromMission(mission: Mission) {
    // TODO: Implémenter la génération automatique côté backend
    console.log('Génération facture pour mission:', mission.id);
    alert(`Facture générée pour la mission "${mission.cours.nom}" (Fonctionnalité à implémenter côté backend)`);
    this.closeGenerateModal();
    this.loadFactures();
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Competence } from '../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  editMode = signal(false);

  // Formulaire
  formData = signal({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    codePostal: '',
    ville: '',
    competences: [] as Competence[]
  });

  newCompetence = signal('');

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const user = this.currentUser();
    if (user) {
      this.formData.set({
        prenom: user.prenom || '',
        nom: user.nom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        adresse: user.adresse || '',
        codePostal: user.codePostal || '',
        ville: user.ville || '',
        competences: user.competences || []
      });
    }
  }

  toggleEditMode() {
    this.editMode.update(v => !v);
    if (!this.editMode()) {
      this.loadUserData(); // Réinitialiser si on annule
    }
  }

  save() {
    console.log('Sauvegarder profil', this.formData());
    this.editMode.set(false);
    // TODO: Appeler le service pour sauvegarder
  }

  addCompetence() {
    const comp = this.newCompetence().trim();
    if (comp) {
      const newComp: Competence = {
        id: `comp-${Date.now()}`,
        nom: comp,
        niveau: 'intermediaire'
      };
      this.formData.update(data => ({
        ...data,
        competences: [...data.competences, newComp]
      }));
      this.newCompetence.set('');
    }
  }

  removeCompetence(competence: Competence) {
    this.formData.update(data => ({
      ...data,
      competences: data.competences.filter(c => c.id !== competence.id)
    }));
  }

  uploadDocument(type: 'rib' | 'kbis' | 'cv' | 'diplome', event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      console.log(`Upload ${type}:`, file.name);
      // TODO: Implémenter upload
    }
  }

  deleteDocument(type: string) {
    console.log(`Supprimer document ${type}`);
    // TODO: Implémenter suppression
  }
}

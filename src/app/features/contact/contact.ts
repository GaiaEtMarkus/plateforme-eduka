import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ContactForm {
  sujet: string;
  message: string;
  priorite: 'normale' | 'urgente';
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  formData = signal<ContactForm>({
    sujet: '',
    message: '',
    priorite: 'normale'
  });

  submitted = signal(false);

  resetForm() {
    this.formData.set({
      sujet: '',
      message: '',
      priorite: 'normale'
    });
    this.submitted.set(false);
  }

  submitForm() {
    console.log('Envoi du formulaire de contact:', this.formData());
    this.submitted.set(true);

    // Réinitialiser après 3 secondes
    setTimeout(() => {
      this.resetForm();
    }, 3000);
  }

  isFormValid(): boolean {
    const data = this.formData();
    return data.sujet.trim().length > 0 && data.message.trim().length > 10;
  }

  updateSujet(value: string) {
    this.formData.update(data => ({ ...data, sujet: value }));
  }

  updatePriorite(value: 'normale' | 'urgente') {
    this.formData.update(data => ({ ...data, priorite: value }));
  }

  updateMessage(value: string) {
    this.formData.update(data => ({ ...data, message: value }));
  }
}

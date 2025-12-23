import { Component } from '@angular/core';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  successMessage = '';
  errorMessage = '';

  constructor(private contactService: ContactService) {}

  submitForm() {
    if (this.formData.name && this.formData.email && this.formData.phone && this.formData.message) {
      try {
        this.contactService.addMessage(
          this.formData.name,
          this.formData.email,
          this.formData.phone,
          this.formData.message
        );
        this.successMessage = 'Message envoyé avec succès! Nous vous répondrons bientôt.';
        this.errorMessage = '';
        this.resetForm();
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      } catch (error) {
        this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
      }
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs.';
    }
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
  }
}

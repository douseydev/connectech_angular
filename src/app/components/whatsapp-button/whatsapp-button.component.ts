import { Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp-button',
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.css']
})
export class WhatsappButtonComponent {
  whatsappNumber = '221772516507';
  message = 'Bonjour! Je suis intéressé par vos produits.';

  getWhatsappUrl() {
    const encodedMessage = encodeURIComponent(this.message);
    return `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;
  }
}

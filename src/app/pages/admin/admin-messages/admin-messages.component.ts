import { Component, OnInit } from '@angular/core';
import { ContactService, ContactMessage } from '../../../services/contact.service';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmService } from '../../../services/confirm.service';

@Component({
  selector: 'app-admin-messages',
  templateUrl: './admin-messages.component.html',
  styleUrl: './admin-messages.component.css'
})
export class AdminMessagesComponent implements OnInit {
  messages: ContactMessage[] = [];
  filteredMessages: ContactMessage[] = [];
  filterStatus: 'all' | 'new' | 'read' = 'all';
  unreadCount = 0;

  constructor(
    private contactService: ContactService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService
  ) { }

  ngOnInit() {
    this.loadMessages();
    setInterval(() => {
      this.loadMessages();
    }, 2000);
  }

  loadMessages() {
    this.messages = this.contactService.getMessages();
    this.unreadCount = this.contactService.getUnreadCount();
    this.filterMessages();
  }

  filterMessages() {
    if (this.filterStatus === 'new') {
      this.filteredMessages = this.messages.filter(m => m.status === 'new');
    } else {
      this.filteredMessages = this.messages;
    }
  }

  async deleteMessage(id: string) {
    const confirmed = await this.confirmService.confirm(
      'Supprimer le message',
      'Voulez-vous vraiment supprimer ce message de contact ?'
    );

    if (confirmed) {
      this.contactService.deleteMessage(id);
      this.notificationService.show('Message supprimé avec succès !', 'success');
      this.loadMessages();
    }
  }

  replyMessage(msg: ContactMessage) {
    // Marquer comme lu
    this.contactService.markAsRead(msg.id);
    this.loadMessages();

    // Ouvrir le client email
    window.location.href = `mailto:${msg.email}?subject=Réponse: Votre message`;
  }
}

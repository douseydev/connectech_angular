import { Injectable } from '@angular/core';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'responded';
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private messages: ContactMessage[] = [];

  constructor() {
    this.loadMessages();
  }

  private loadMessages() {
    const stored = localStorage.getItem('contactMessages');
    if (stored) {
      this.messages = JSON.parse(stored);
    }
  }

  private saveMessages() {
    localStorage.setItem('contactMessages', JSON.stringify(this.messages));
  }

  addMessage(name: string, email: string, phone: string, message: string): ContactMessage {
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      message,
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'new'
    };
    this.messages.unshift(newMessage);
    this.saveMessages();
    return newMessage;
  }

  getMessages(): ContactMessage[] {
    return this.messages;
  }

  markAsRead(id: string) {
    const msg = this.messages.find(m => m.id === id);
    if (msg) {
      msg.status = 'read';
      this.saveMessages();
    }
  }

  deleteMessage(id: string) {
    this.messages = this.messages.filter(m => m.id !== id);
    this.saveMessages();
  }

  getUnreadCount(): number {
    return this.messages.filter(m => m.status === 'new').length;
  }
}

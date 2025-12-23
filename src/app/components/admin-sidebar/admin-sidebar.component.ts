import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent implements OnInit {
  unreadCount = 0;

  constructor(
    private router: Router,
    private contactService: ContactService
  ) {}

  ngOnInit() {
    this.updateUnreadCount();
    setInterval(() => {
      this.updateUnreadCount();
    }, 2000);
  }

  updateUnreadCount() {
    this.unreadCount = this.contactService.getUnreadCount();
  }

  logout() {
    localStorage.removeItem('isAdminLoggedIn');
    this.router.navigate(['/admin/login']);
  }
}

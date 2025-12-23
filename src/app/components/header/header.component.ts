import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isAdminLoggedIn = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Vérifier si connecté au chargement
    this.checkAdminStatus();
    // Écouter les changements de route
    this.router.events.subscribe(() => {
      this.checkAdminStatus();
    });
  }

  checkAdminStatus() {
    this.isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    localStorage.removeItem('isAdminLoggedIn');
    this.isAdminLoggedIn = false;
    this.router.navigate(['/']);
  }
}

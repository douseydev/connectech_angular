import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  email = '';
  password = '';
  showPassword = false;
  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        // Verify role based on DB schema ('admin')
        if (response.role === 'admin') {
          localStorage.setItem('isAdminLoggedIn', 'true');
          localStorage.setItem('user_role', response.role);
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage = 'Accès refusé. Vous n\'êtes pas administrateur.';
          this.authService.logout(); // Clear any tokens set by service
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error', err);
        this.errorMessage = 'Email ou mot de passe incorrect'; // or err.error.message
      }
    });
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.login();
    }
  }
}

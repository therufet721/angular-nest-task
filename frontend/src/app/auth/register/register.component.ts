import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  login = '';
  password = '';
  confirmPassword = '';
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  isLoading = this.authService.isLoading;

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.login || !this.password || !this.confirmPassword) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    // Login validation
    if (this.login.length < 3 || this.login.length > 30) {
      this.errorMessage.set('Login must be between 3 and 30 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(this.login)) {
      this.errorMessage.set('Login can only contain letters, numbers, and underscores');
      return;
    }

    // Password validation - must match backend requirements
    if (this.password.length < 8) {
      this.errorMessage.set('Password must be at least 8 characters');
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(this.password)) {
      this.errorMessage.set('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.authService.register({ login: this.login, password: this.password }).subscribe({
      next: () => {
        this.successMessage.set('Registration successful! Redirecting to login...');
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Registration failed');
      }
    });
  }
}

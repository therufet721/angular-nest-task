import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  login = '';
  password = '';
  errorMessage = signal<string>('');
  isLoading = this.authService.isLoading;

  onSubmit(): void {
    this.errorMessage.set('');

    if (!this.login || !this.password) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    this.authService.login({ login: this.login, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/items']);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Invalid credentials');
      }
    });
  }
}

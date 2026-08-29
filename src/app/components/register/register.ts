import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private authService = inject(AuthService);
  private router = inject(Router);

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  phone = '';
  address = '';

  register(): void {

    const user = {

      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      phone: this.phone,
      address: this.address

    };

    this.authService.register(user).subscribe({

      next: (message) => {

        alert(message);

        this.router.navigate(['/login']);

      },

      error: (error) => {

        console.log(error);

        alert('Registration Failed');

      }

    });

  }

}
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  private apiUrl = 'http://localhost:8080/api/auth';


  // =====================================================
  // FORM DATA
  // =====================================================

  email = '';

  otp = '';

  newPassword = '';

  confirmPassword = '';


  // =====================================================
  // PAGE STEP
  // 1 = Email
  // 2 = OTP
  // 3 = New Password
  // =====================================================

  step: number = 1;


  // =====================================================
  // LOADING
  // =====================================================

  loading = false;


  // =====================================================
  // SEND OTP
  // =====================================================

  sendOtp(): void {

     if (!this.email || this.email.trim() === '') {

        alert('Please enter your email.');

        return;
    }

    this.loading = true;

    const request = {
        email: this.email.trim()
    };

    console.log('Sending OTP request:', request);

    this.http.post(
        `${this.apiUrl}/forgot-password`,
        request,
        {
            responseType: 'text'
        }
    ).subscribe({

        next: (response: string) => {

            console.log('Backend response:', response);

            // Stop loading first
            this.loading = false;

            // Move to OTP screen
            this.step = 2;
            this.cdr.detectChanges();

            console.log(
                'Step changed to:',
                this.step
            );

        },

        error: (error) => {

            console.error(
                'Forgot password error:',
                error
            );

            this.loading = false;

            alert(
                error.error ||
                'Unable to send OTP.'
            );

        }

    });
  }


  // =====================================================
  // VERIFY OTP
  // =====================================================

  verifyOtp(): void {

    if (!this.otp) {

      alert('Please enter the OTP.');

      return;
    }

    if (!/^\d{6}$/.test(this.otp)) {

      alert('Please enter a valid 6-digit OTP.');

      return;
    }

    this.loading = true;

    const request = {

      email: this.email,

      otp: this.otp

    };

    console.log(
      'Verifying OTP:',
      request
    );

    this.http.post(
      `${this.apiUrl}/verify-otp`,
      request,
      {
        responseType: 'text'
      }
    ).subscribe({

      next: (response: string) => {

        console.log(
          'OTP verification response:',
          response
        );

        this.loading = false;

        this.step = 3;
        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'OTP verification error:',
          error
        );

        this.loading = false;

        alert(
          error.error ||
          'Invalid OTP.'
        );

      }

    });

  }


  // =====================================================
  // RESET PASSWORD
  // =====================================================

  resetPassword(): void {

    if (!this.newPassword) {

      alert('Please enter a new password.');

      return;
    }

    if (this.newPassword.length < 8) {

      alert(
        'Password must be at least 8 characters.'
      );

      return;
    }

    if (
      this.newPassword !==
      this.confirmPassword
    ) {

      alert('Passwords do not match.');

      return;
    }

    this.loading = true;

    const request = {

      email: this.email,

      newPassword: this.newPassword,

      confirmPassword: this.confirmPassword

    };

    this.http.post(
      `${this.apiUrl}/reset-password`,
      request,
      {
        responseType: 'text'
      }
    ).subscribe({

      next: (response: string) => {

        console.log(
          'Password reset response:',
          response
        );

        this.loading = false;

        alert(
          'Password reset successfully! Please login.'
        );

        this.router.navigate(['/login']);

      },

      error: (error) => {

        console.error(
          'Password reset error:',
          error
        );

        this.loading = false;

        alert(
          error.error ||
          'Unable to reset password.'
        );

      }

    });

  }


  // =====================================================
  // BACK TO LOGIN
  // =====================================================

  backToLogin(): void {

    this.router.navigate(['/login']);

  }

}
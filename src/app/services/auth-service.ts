import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/auth';

  private router = inject(Router);

  register(user: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/register`,
      user,
      { responseType: 'text' }
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login`,
      credentials
    );
  }

  setLoggedIn(): void{
    localStorage.setItem('swaadUserLoggedIn', 'true');
  }

  isLoggedIn(): boolean{
    return localStorage.getItem('swaadUserLoggedIn') !== null;
  }

  logout(): void{
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  sendLoginOtp(request: any){
    return this.http.post(
    `${this.apiUrl}/login/send-otp`,
    request,
    {
      responseType: 'text'
    }
  );
  }

  verifyLoginOtp(request: any): Observable<any>{
    return this.http.post(
    `${this.apiUrl}/login/verify-otp`,
    request
  );
  }
}
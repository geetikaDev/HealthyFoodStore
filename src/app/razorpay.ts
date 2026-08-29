import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Razorpay {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api';

  createOrder(amount: number): Observable<any>{
    return this.http.post(
      `${this.apiUrl}/create-order`,
      {amount}
    );
  }

  verifyPayment(paymentData: any): Observable<string>{
  return this.http.post(
    `${this.apiUrl}/verify-payment`,
    paymentData,
    { responseType: 'text' }
  );
}
}

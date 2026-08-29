import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';


/* =====================================================
   ORDER ITEM
===================================================== */

export interface OrderItem {

  productName: string;

  quantity: number;

  price: number;

  subtotal: number;

}


/* =====================================================
   ORDER
===================================================== */

export interface Order {

  orderId: number;

  customerName: string;

  email: string;

  phone: string;

  address: string;

  totalAmount: number;

  orderDate: string;

  items: OrderItem[];

}


/* =====================================================
   ORDER SERVICE
===================================================== */

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  private http = inject(HttpClient);


  private apiUrl =
    'http://localhost:8080/api/orders';


  /* ===================================================
     PLACE ORDER
  =================================================== */

  placeOrder(order: any) {

    return this.http.post(
      this.apiUrl,
      order,
      {
        responseType: 'text'
      }
    );

  }


  /* ===================================================
     GET MY ORDERS
  =================================================== */

  getMyOrders(
    email: string
  ): Observable<Order[]> {

    return this.http.get<Order[]>(
      `${this.apiUrl}?email=${encodeURIComponent(email)}`
    );

  }

}
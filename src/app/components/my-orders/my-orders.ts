import { Component, inject, OnInit } from '@angular/core';

import {
  OrderService,
  Order
} from '../../services/OrderService';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-my-orders',

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './my-orders.html',

  styleUrl: './my-orders.css',
})


export class MyOrders implements OnInit {

  private orderService = inject(OrderService);


  orders: Order[] = [];

  loading = true;

  errorMessage = '';

  hasOrders = false;


  // Selected order for popup
  selectedOrder: Order | null = null;


  ngOnInit(): void {

    this.loadOrders();

  }


  loadOrders(): void {

    const userData = sessionStorage.getItem('user');


    if (!userData) {

      this.loading = false;

      this.errorMessage =
        'Please login to view your orders.';

      return;

    }


    let user: any;


    try {

      user = JSON.parse(userData);

    } catch (error) {

      console.error(
        'Invalid user session:',
        error
      );

      this.loading = false;

      this.errorMessage =
        'Please login again.';

      return;

    }


    const email = user?.email;


    if (!email) {

      this.loading = false;

      this.errorMessage =
        'Unable to find your email. Please login again.';

      return;

    }


    this.orderService
      .getMyOrders(email)

      .subscribe({

        next: (response: Order[]) => {

          console.log(
            'My Orders:',
            response
          );


          // Store orders
          this.orders = response || [];


          // Set this only after API response
          this.hasOrders = this.orders.length > 0;


          this.loading = false;

        },


        error: (error) => {

          console.error(
            'Failed to load orders:',
            error
          );


          this.orders = [];

          this.hasOrders = false;

          this.errorMessage =
            'Unable to load your orders.';

          this.loading = false;

        }

      });

  }


  // =====================================================
  // OPEN ORDER POPUP
  // =====================================================

  openOrder(order: Order): void {

    this.selectedOrder = order;

  }


  // =====================================================
  // CLOSE ORDER POPUP
  // =====================================================

  closeOrder(): void {

    this.selectedOrder = null;

  }

}
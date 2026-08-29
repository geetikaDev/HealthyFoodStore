import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/CartService';
import { CartItem } from '../../models/cart-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);

  cartItems: CartItem[]=[];

  customerName = '';
  email = '';
  phone = '';
  address = '';

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();

    if(this.cartItems.length===0){
      this.router.navigate(['/products']);
      return;
    }
  }

  getTotal():number{
    return this.cartService.getTotalAmount();
  }

  placeOrder(): void {

  const checkoutData = {

    customerName: this.customerName,
    email: this.email,
    phone: this.phone,
    address: this.address

  };

  sessionStorage.setItem(
    'checkoutData',
    JSON.stringify(checkoutData)
  );

  this.router.navigate(['/payment']);

}
}


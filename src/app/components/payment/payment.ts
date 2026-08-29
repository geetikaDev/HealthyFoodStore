import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/CartService';
import { CartItem } from '../../models/cart-item';
import { OrderService } from '../../services/OrderService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  customerName = '';
  email = '';
  phone = '';
  address = '';

  cartItems: CartItem[]=[];

  paymentMethod = 'upi';
  upiId = '';

  cardNumber = '';
  expiry = '';
  cvv ='';

  selectedBank = '';

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();

    if(this.cartItems.length===0){
      this.router.navigate(['/products']);
    }

    const data = sessionStorage.getItem('checkoutData');

    if(data){
      const checkoutData = JSON.parse(data);

      this.customerName = checkoutData.customerName;
      this.email = checkoutData.email;
      this.phone = checkoutData.phone;
      this.address = checkoutData.address;
    }
  }

  getTotal():number{
    return this.cartService.getTotalAmount();
  }

  payNow(): void{
    if(this.paymentMethod === 'upi' && !this.upiId.trim()){
      alert('Please enter your UPI ID');
      return;
    }
    if(this.paymentMethod === 'card' && (!this.cardNumber || !this.expiry || !this.cvv)){
      alert('Please enter card details');
      return;
    }
    if(this.paymentMethod === 'netbanking' && !this.selectedBank){
      alert('Please select your bank');
      return;
    }
    
    const order = {

  customerName: this.customerName,
  email: this.email,
  phone: this.phone,
  address: this.address,

  items: this.cartItems.map(item => ({
    productId: item.product.productId,
    quantity: item.quantity
  }))

};

this.orderService.placeOrder(order).subscribe({

  next: () => {

    alert('Payment Successful!');

    this.cartService.clearCart();

    sessionStorage.removeItem('checkoutData');

    this.router.navigate(['/order-success']);

  },

  error: (error) => {

    console.log(error);

    alert('Failed to place order.');

  }

});
  }
}

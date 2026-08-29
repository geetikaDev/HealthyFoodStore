import { Component, inject } from '@angular/core';
import { CartService } from '../../services/CartService';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Razorpay } from '../../razorpay';
import { OrderService } from '../../services/OrderService';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  private cartService = inject(CartService);
  private razorpayService = inject(Razorpay);
  private router = inject(Router);
  private orderService = inject(OrderService);


  cart$ = this.cartService.cart$;


  increase(productId: number): void {

    this.cartService.increaseQuantity(productId);

  }


  decrease(productId: number): void {

    this.cartService.decreaseQuantity(productId);

  }


  remove(productId: number): void {

    this.cartService.removeFromCart(productId);

  }


  getTotal(): number {

    return this.cartService.getTotalAmount();

  }


  // =====================================================
  // CHECKOUT
  // =====================================================

  proceedToCheckout(): void {

    const token = sessionStorage.getItem('token');


    if (!token) {

      alert(
        'Please login before proceeding to payment.'
      );

      this.router.navigate(['/login']);

      return;

    }


    const userData =
      sessionStorage.getItem('user');


    if (!userData) {

      alert(
        'User information not found. Please login again.'
      );

      sessionStorage.clear();

      this.router.navigate(['/login']);

      return;

    }


    const user = JSON.parse(userData);


    const totalAmount =
      this.getTotal();


    if (totalAmount <= 0) {

      alert('Your cart is empty');

      return;

    }


    console.log(
      'Cart Total:',
      totalAmount
    );


    // =================================================
    // CREATE RAZORPAY ORDER
    // =================================================

    this.razorpayService
      .createOrder(totalAmount)

      .subscribe({

        next: (response: any) => {

          console.log(
            'Razorpay Order Created JSON:',
            JSON.stringify(response)
          );


          const options = {

            key: 'rzp_test_TQu2VIEM9smf9A',

            amount: response.amount,

            currency: response.currency,

            name: 'Swaad Junction',

            description:
              'Healthy Homemade Snacks & Traditional Indian Foods',

            order_id: response.id,


            // =========================================
            // PAYMENT SUCCESS
            // =========================================

            handler: (paymentResponse: any) => {


              console.log(
                'Payment Successful JSON:',
                JSON.stringify(paymentResponse)
              );


              const verificationData = {

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature

              };


              console.log(
                'Verification Data:',
                JSON.stringify(verificationData)
              );


              // =======================================
              // VERIFY PAYMENT
              // =======================================

              this.razorpayService
                .verifyPayment(verificationData)

                .subscribe({

                  next: (verificationResponse: any) => {


                    console.log(
                      'Payment Verification:',
                      verificationResponse
                    );


                    // =================================
                    // GET CURRENT CART ITEMS
                    // =================================

                    const cartItems =
                      this.cartService.getCartItems();


                    console.log(
                      'Cart Items:',
                      JSON.stringify(cartItems)
                    );


                    // =================================
                    // CREATE ORDER ITEMS
                    // =================================

                    const items =
                      cartItems.map(item => ({

                        productId:
                          item.productId || item.product.productId,

                        quantity:
                          item.quantity

                      }));


                    // =================================
                    // CREATE ORDER REQUEST
                    // =================================

                    const order = {

                      customerName:
                        `${user.firstName} ${user.lastName}`,

                      email:
                        user.email,

                      phone:
                        user.phone || '',

                      address:
                        user.address || '',

                      totalAmount:
                        totalAmount,

                      items:
                        items

                    };

                    console.log(
    'Cart Items Before Order:',
    JSON.stringify(cartItems)
);

                    console.log(
                      'Saving Order:',
                      JSON.stringify(order)
                    );


                    // =================================
                    // SAVE ORDER
                    // =================================

                    this.orderService
                      .placeOrder(order)

                      .subscribe({

                        next: (orderResponse: any) => {


                          console.log(
                            'Order Saved Successfully:',
                            orderResponse
                          );


                          // =============================
                          // CLEAR CART ONLY AFTER
                          // ORDER IS SUCCESSFULLY SAVED
                          // =============================

                          this.cartService.clearCart();


                          alert(
                            'Payment successful and order placed successfully! 🎉'
                          );


                          this.router.navigate([
                            '/my-orders'
                          ]);

                        },


                        error: (orderError) => {


                          console.error(
                            'Order Saving Failed:',
                            orderError
                          );


                          alert(
                            'Payment was successful, but we could not save your order. Please contact support.'
                          );

                        }

                      });

                  },


                  error: (error) => {


                    console.error(
                      'Payment Verification Failed:',
                      error
                    );


                    alert(
                      'Payment Verification Failed. Please contact support.'
                    );

                  }

                });

            },


            // =========================================
            // PAYMENT POPUP CLOSED
            // =========================================

            modal: {

              ondismiss: () => {

                console.log(
                  'Payment popup closed'
                );

              }

            },


            theme: {

              color: '#A52A2A'

            }

          };


          const razorpay =
            new (window as any).Razorpay(options);


          razorpay.open();

        },


        error: (error) => {


          console.error(
            'Razorpay Order Creation Failed:',
            error
          );


          alert(
            'Unable to create Razorpay order'
          );

        }

      });

  }

}
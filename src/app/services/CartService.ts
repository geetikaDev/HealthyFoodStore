import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private cart: CartItem[] = [];

  private cartSubject =
    new BehaviorSubject<CartItem[]>([]);

  cart$ = this.cartSubject.asObservable();


  private cartCount =
    new BehaviorSubject<number>(0);

  cartCount$ =
    this.cartCount.asObservable();


  constructor() {

    this.loadCart();

  }


  // =====================================================
  // GET CART ITEMS
  // =====================================================

  getCartItems(): CartItem[] {

    return this.cart;

  }


  // =====================================================
  // ADD TO CART
  // =====================================================

  addToCart(
    product: Product,
    quantity: number,
    unit: string
  ): void {

    if (quantity <= 0) {

      return;

    }


    const existingItem =
      this.cart.find(

        item =>
          item.product.productId ===
            product.productId &&

          item.unit.toLowerCase() ===
            unit.toLowerCase()

      );


    if (existingItem) {

      existingItem.quantity += quantity;

      existingItem.totalAmount =
        this.calculateAmount(
          product,
          existingItem.quantity,
          existingItem.unit
        );

    }

    else {
      this.cart.push({
        productId: product.productId,

        product: product,

        quantity: quantity,

        unit: unit,

        price: product.price,

        totalAmount:
            this.calculateAmount(
                product,
                quantity,
                unit
            )
      });
    }


    this.updateCart();

  }


  // =====================================================
  // CALCULATE AMOUNT
  // =====================================================

  calculateAmount(
    product: Product,
    quantity: number,
    unit: string
  ): number {

    if (
      !product ||
      !quantity ||
      quantity <= 0
    ) {

      return 0;

    }


    const normalizedUnit =
      unit.toLowerCase();


    let quantityInKg = 0;


    // Gram → Kilogram

    if (
      normalizedUnit === 'g' ||
      normalizedUnit === 'gram' ||
      normalizedUnit === 'grams'
    ) {

      quantityInKg =
        quantity / 1000;

    }


    // Kilogram

    else if (
      normalizedUnit === 'kg' ||
      normalizedUnit === 'kilogram' ||
      normalizedUnit === 'kilograms'
    ) {

      quantityInKg =
        quantity;

    }


    else {

      return 0;

    }


    return Number(
      (
        Number(product.price) *
        quantityInKg
      ).toFixed(2)
    );

  }


  // =====================================================
  // REMOVE
  // =====================================================

  removeFromCart(
    productId: number
  ): void {

    this.cart =
      this.cart.filter(

        item =>
          item.product.productId !==
          productId

      );


    this.updateCart();

  }


  // =====================================================
  // INCREASE
  // =====================================================

  /*
   * Increase by:
   *
   * Gram item     → 100 g
   * Kilogram item → 0.1 kg
   *
   * This keeps the cart useful while still
   * allowing arbitrary quantities from the popup.
   */

  increaseQuantity(
    productId: number
  ): void {

    const item =
      this.cart.find(

        item =>
          item.product.productId ===
          productId

      );


    if (!item) {

      return;

    }


    if (
      item.unit.toLowerCase() === 'g'
    ) {

      item.quantity += 100;

    }

    else {

      item.quantity =
        Number(
          (item.quantity + 0.1)
            .toFixed(2)
        );

    }


    item.totalAmount =
      this.calculateAmount(
        item.product,
        item.quantity,
        item.unit
      );


    this.updateCart();

  }


  // =====================================================
  // DECREASE
  // =====================================================

  decreaseQuantity(
    productId: number
  ): void {

    const item =
      this.cart.find(

        item =>
          item.product.productId ===
          productId

      );


    if (!item) {

      return;

    }


    if (
      item.unit.toLowerCase() === 'g'
    ) {

      item.quantity -= 100;

    }

    else {

      item.quantity =
        Number(
          (item.quantity - 0.1)
            .toFixed(2)
        );

    }


    if (item.quantity <= 0) {

      this.cart =
        this.cart.filter(

          cartItem =>
            cartItem.product.productId !==
            productId

        );

    }

    else {

      item.totalAmount =
        this.calculateAmount(
          item.product,
          item.quantity,
          item.unit
        );

    }


    this.updateCart();

  }


  // =====================================================
  // TOTAL
  // =====================================================

  getTotalAmount(): number {

    return Number(

      this.cart.reduce(

        (total, item) =>
          total + item.totalAmount,

        0

      ).toFixed(2)

    );

  }


  // =====================================================
  // SAVE CART
  // =====================================================

  private saveCart(): void {

    localStorage.setItem(

      'cart',

      JSON.stringify(this.cart)

    );

  }


  // =====================================================
  // LOAD CART
  // =====================================================

  private loadCart(): void {

    const data =
      localStorage.getItem('cart');


    if (data) {

      try {

        const savedCart =
          JSON.parse(data);


        /*
         * Old cart items do not contain
         * unit and totalAmount.
         *
         * Remove them because their quantity
         * represented product count and the
         * new system represents weight.
         */

        if (
          Array.isArray(savedCart) &&
          savedCart.every(
            item =>
              item &&
              item.product &&
              item.unit !== undefined &&
              item.totalAmount !== undefined
          )
        ) {

          this.cart = savedCart;

        }

        else {

          this.cart = [];

          localStorage.removeItem('cart');

        }

      }

      catch {

        this.cart = [];

        localStorage.removeItem('cart');

      }

    }


    this.cartSubject.next([
      ...this.cart
    ]);


    this.cartCount.next(
      this.cart.length
    );

  }


  // =====================================================
  // CLEAR CART
  // =====================================================

  clearCart(): void {

    this.cart = [];

    localStorage.removeItem('cart');

    this.cartSubject.next([]);

    this.cartCount.next(0);

    console.log(
      'CART CLEARED SUCCESSFULLY'
    );

  }


  // =====================================================
  // UPDATE CART
  // =====================================================

  private updateCart(): void {

    this.saveCart();

    this.cartSubject.next([
      ...this.cart
    ]);

    this.cartCount.next(
      this.cart.length
    );

  }


  // =====================================================
  // CART COUNT
  // =====================================================

  getCartCount(): number {

    return this.cart.length;

  }


  // =====================================================
  // PRODUCT QUANTITY
  // =====================================================

  getQuantity(
    productId: number
  ): number {

    const items =
      this.cart.filter(

        item =>
          item.product.productId ===
          productId

      );


    if (items.length === 0) {

      return 0;

    }


    return items.reduce(

      (total, item) =>
        total + item.quantity,

      0

    );

  }

}
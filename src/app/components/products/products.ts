import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';

import { ProductService } from '../../services/product';
import { Product } from '../../models/product';

import { CommonModule } from '@angular/common';

import { CartService } from '../../services/CartService';

import { Subscription } from 'rxjs';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-products',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],

  templateUrl: './products.html',

  styleUrl: './products.css',
})
export class Products
  implements OnInit, OnDestroy {


  private productService =
    inject(ProductService);

  private cartService =
    inject(CartService);

  private route =
    inject(ActivatedRoute);

  private cdr =
    inject(ChangeDetectorRef);


  // =====================================================
  // CATEGORY
  // =====================================================

  selectedCategory = '';


  // =====================================================
  // SEARCH
  // =====================================================

  searchTerm = '';


  // =====================================================
  // PRODUCTS
  // =====================================================

  products: Product[] = [];


  categories: string[] = [

    'Snacks',
    'Drinks',
    'Wafers',
    'Daily Specials',
    'Festive Foods'

  ];


  loading = true;


  // =====================================================
  // TOAST
  // =====================================================

  showToast = false;

  toastMessage = '';


  // =====================================================
  // CART
  // =====================================================

  cartCount = 0;

  private cartSubscription?: Subscription;


  // =====================================================
  // QUANTITY MODAL
  // =====================================================

  showQuantityModal = false;

  selectedProduct: Product | null = null;

  selectedQuantity: number = 0;

  selectedUnit = 'g';

  calculatedAmount = 0;


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.selectedCategory =
      this.route.snapshot.queryParamMap
        .get('category') || '';


    this.searchTerm =
      this.route.snapshot.queryParamMap
        .get('search') || '';


    this.loadProducts();


    this.cartCount =
      this.cartService.getCartCount();


    this.cartSubscription =
      this.cartService.cartCount$
        .subscribe(count => {

          this.cartCount = count;

        });

  }


  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  loadProducts(): void {

    this.loading = true;


    this.productService
      .getAllProducts()
      .subscribe({

        next: (data: Product[]) => {

          let filteredProducts = data;


          // CATEGORY

          if (this.selectedCategory) {

            filteredProducts =
              filteredProducts.filter(product =>

                product.category
                  ?.categoryName
                  ?.toLowerCase() ===
                this.selectedCategory
                  .toLowerCase()

              );

          }


          // SEARCH

          if (this.searchTerm.trim()) {

            const search =
              this.searchTerm
                .trim()
                .toLowerCase();


            filteredProducts =
              filteredProducts.filter(product => {

                const productName =
                  product.productName
                    ?.toLowerCase() || '';


                const description =
                  product.description
                    ?.toLowerCase() || '';


                const category =
                  product.category
                    ?.categoryName
                    ?.toLowerCase() || '';


                return (

                  productName.includes(search) ||

                  description.includes(search) ||

                  category.includes(search)

                );

              });

          }


          this.products =
            filteredProducts;


          this.loading = false;


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Error Loading Products:',
            error
          );


          this.products = [];

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // PRODUCTS BY CATEGORY
  // =====================================================

  getProductsByCategory(
    categoryName: string
  ): Product[] {

    return this.products.filter(

      product =>

        product.category
          ?.categoryName
          ?.toLowerCase() ===
        categoryName.toLowerCase()

    );

  }


  // =====================================================
  // OPEN QUANTITY MODAL
  // =====================================================

  addToCart(product: Product): void {

    this.selectedProduct =
      product;


    /*
     * Default quantity.
     *
     * Customer can change it.
     */

    this.selectedQuantity = 100;


    /*
     * For food products use grams
     * as the initial selection.
     */

    this.selectedUnit = 'g';


    this.calculateAmount();


    this.showQuantityModal = true;

  }


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  closeQuantityModal(): void {

    this.showQuantityModal = false;

    this.selectedProduct = null;

    this.selectedQuantity = 0;

    this.selectedUnit = 'g';

    this.calculatedAmount = 0;

  }


  // =====================================================
  // CALCULATE AMOUNT
  // =====================================================

  calculateAmount(): void {

    if (
      !this.selectedProduct ||
      !this.selectedQuantity ||
      this.selectedQuantity <= 0
    ) {

      this.calculatedAmount = 0;

      return;

    }


    let quantityInKg = 0;


    if (
      this.selectedUnit === 'g'
    ) {

      quantityInKg =
        this.selectedQuantity / 1000;

    }

    else if (
      this.selectedUnit === 'kg'
    ) {

      quantityInKg =
        this.selectedQuantity;

    }


    this.calculatedAmount =
      Number(

        (
          Number(
            this.selectedProduct.price
          ) *
          quantityInKg

        ).toFixed(2)

      );

  }


  // =====================================================
  // ADD SELECTED WEIGHT TO CART
  // =====================================================

  confirmAddToCart(): void {

    if (!this.selectedProduct) {

      return;

    }


    if (
      !this.selectedQuantity ||
      this.selectedQuantity <= 0
    ) {

      alert(
        'Please enter a valid quantity.'
      );

      return;

    }


    this.calculateAmount();


    this.cartService.addToCart(

      this.selectedProduct,

      this.selectedQuantity,

      this.selectedUnit

    );


    this.toastMessage =
      `${this.selectedProduct.productName} added to cart`;


    this.showToast = true;


    this.closeQuantityModal();


    setTimeout(() => {

      this.showToast = false;

    }, 2000);

  }


  // =====================================================
  // GET QUANTITY
  // =====================================================

  getQuantity(
    product: Product
  ): number {

    return this.cartService.getQuantity(
      product.productId
    );

  }


  // =====================================================
  // INCREASE
  // =====================================================

  increase(
    product: Product
  ): void {

    this.cartService.increaseQuantity(
      product.productId
    );

  }


  // =====================================================
  // DECREASE
  // =====================================================

  decrease(
    product: Product
  ): void {

    this.cartService.decreaseQuantity(
      product.productId
    );

  }


  // =====================================================
  // DESTROY
  // =====================================================

  ngOnDestroy(): void {

    this.cartSubscription?.unsubscribe();

  }

}
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {

  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  copiedCoupon: string = '';

  slides: string[] =[
    '/images/slide1.png',
    '/images/slide2.png',
    '/images/slide3.png',
    '/images/slide4.png',
  ]

  currentSlide: number = 0;

  private slideInterval: any;

  ngOnInit(): void {
    this.startSlider();
  }

  startSlider(): void {

  this.slideInterval = setInterval(() => {

    this.currentSlide =
      (this.currentSlide + 1) % this.slides.length;

    this.cdr.detectChanges();

  }, 5000);

}

nextSlide(): void {

  this.currentSlide =
    (this.currentSlide + 1) % this.slides.length;

  this.restartSlider();

}

previousSlide(): void {

  this.currentSlide =
    (this.currentSlide - 1 + this.slides.length) %
    this.slides.length;

  this.restartSlider();

}

restartSlider(): void {

  clearInterval(this.slideInterval);

  this.startSlider();

}

  goToProducts(): void{
    this.router.navigate(['/products']);
  }
  ngOnDestroy(): void {
    if(this.slideInterval){
      clearInterval(this.slideInterval);
    }
  }

  copyCoupon(coupon: string): void {

  navigator.clipboard.writeText(coupon).then(() => {

    this.copiedCoupon = coupon;

    setTimeout(() => {

      this.copiedCoupon = '';

    }, 2000);

  }).catch(error => {

    console.error(
      'Unable to copy coupon:',
      error
    );

  });

}

}


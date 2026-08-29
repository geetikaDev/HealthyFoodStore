import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/CartService';
import { Category } from '../../services/category';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  private cartService = inject(CartService);

  animateCart = false;

  isLoggedIn = false;
  firstName = '';

  cartCount = 0;

  showEmptyCartPopup = false;

  private emptyCartPopupTimer: any;

  categoryDialogOpen = false;

  private typingInterval: any;
  searchIndex=0;
  searchCharIndex = 0;
  isDeleting = false;

searchPlaceholder = '';
searchText='';

searchPlaceholders: string[] = [
  'Search Chakali',
  'Search Modak',
  'Search Chiwada',
  'Search Wafers',
  'Search Aamras Syrup',
  'Search Nachni Wafers'
];

  currentAnnouncement = 0;
  private announcementInterval: any;

  private categoryTimeout: any;

  openCategoryDialog(): void{
    clearTimeout(this.categoryTimeout);
    this.categoryDialogOpen = true;
  }

  startCategoryClose(): void {

    this.categoryTimeout = setTimeout(() => {

        this.categoryDialogOpen = false;

    }, 200);

}


  closeCategoryDialog(): void{
    this.categoryDialogOpen = false;
  }

  constructor(private router:Router, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.loadUser();
    this.startSearchTyping();

    this.cartCount = this.cartService.getCartCount();

    this.cartService.cartCount$.subscribe(count => {

      if (count > this.cartCount) {

    this.animateCart = true;

    setTimeout(() => {

      this.animateCart = false;

    }, 400);

  }

      this.cartCount = count;

    });

    if(this.isLoggedIn && this.cartCount === 0){
      setTimeout(() => {
        this.showEmptyCartMessage();
      }, 500);
    }

    this.announcementInterval = setInterval(() => {
      this.currentAnnouncement++;
      if(this.currentAnnouncement > 3){
        this.currentAnnouncement =0;
      }
    }, 5000)
  }

  startSearchTyping(): void {

  const currentText =
    this.searchPlaceholders[this.searchIndex];

  if (!this.isDeleting) {

    // Add one character
    this.searchCharIndex++;

    this.searchPlaceholder =
      currentText.substring(0, this.searchCharIndex);

    this.cdr.detectChanges();

    // Full word is completed
    if (this.searchCharIndex === currentText.length) {

      this.isDeleting = true;

      // Wait before starting deletion
      setTimeout(() => {
        this.startSearchTyping();
      }, 1500);

      return;
    }

  } else {

    // Remove one character
    this.searchCharIndex--;

    this.searchPlaceholder =
      currentText.substring(0, this.searchCharIndex);

    this.cdr.detectChanges();

    // Word completely deleted
    if (this.searchCharIndex === 0) {

      this.isDeleting = false;

      this.searchIndex =
        (this.searchIndex + 1) %
        this.searchPlaceholders.length;
    }

  }

  // Typing speed / deleting speed
  clearTimeout(this.typingInterval);

  this.typingInterval = setTimeout(() => {
    this.startSearchTyping();
  }, this.isDeleting ? 80 : 120);
}

  loadUser(): void{
    const token = sessionStorage.getItem('token');
    const user = sessionStorage.getItem('user');

    if(token && user){
      this.isLoggedIn = true;
      const userData = JSON.parse(user);
      this.firstName = userData.firstName;
    } else{
      this.isLoggedIn = false;
      this.firstName = '';
    }
  }

  logout(): void{
    sessionStorage.clear();
    this.isLoggedIn = false;
    this.firstName = '';
    this.showEmptyCartPopup = false;
    clearTimeout(this.emptyCartPopupTimer);
    alert("Logged out successfully");
    this.router.navigate(['/login']);
  }

  goToCategory(category: string): void{
    this.categoryDialogOpen = false;

    this.router.navigate(['/products'], 
      {
        queryParams: {
          category: category,
          search: null
        }
      }
    );
  }

    searchProduct(): void{
      const search = this.searchText.trim();
      if(!search){
        this.router.navigate(['/products']);
        return;
      }

      this.router.navigate(['/products'], {
        queryParams: {
          search: search,
          category: null
        }
      });
    }

  ngOnDestroy(): void{
    if(this.announcementInterval){
      clearInterval(this.announcementInterval);
    }

    if(this.announcementInterval){
      clearInterval(this.announcementInterval);
    }
  }

  showEmptyCartMessage(): void {

  // Don't show if user is not logged in
  if (!this.isLoggedIn) {
    return;
  }

  // Don't show if cart contains products
  if (this.cartCount > 0) {
    return;
  }

  this.showEmptyCartPopup = true;

  // Clear previous timer if any
  clearTimeout(this.emptyCartPopupTimer);

  // Hide after 10 seconds
  this.emptyCartPopupTimer = setTimeout(() => {

    this.showEmptyCartPopup = false;

  }, 10000);
}
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [FormsModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

  subscriberEmail: string = '';

  subscribe(): void{
    if(!this.subscriberEmail){
      alert('Please enter your email address.');
      return;
    }
    alert('Thank you for subscribing to Swaad Junction!');
    this.subscriberEmail = '';
  }
}

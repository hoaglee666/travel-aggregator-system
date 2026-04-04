import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss'],
})
export class CheckoutComponent implements OnInit {
  provider: string = '';
  hotelName: string = '';
  price: string = '';

  checkoutForm: FormGroup;
  isBooked: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.checkoutForm = this.fb.group({
      guestName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.minLength(16)]],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Read the query parameters from the URL
    this.route.queryParams.subscribe((params) => {
      this.provider = params['provider'] || 'Partner Website';
      this.hotelName = params['hotel'] || 'Selected Hotel';
      this.price = params['price'] || '0';
    });

    const userDataString = localStorage.getItem('user_data');
    if (userDataString) {
      const user = JSON.parse(userDataString);
      this.checkoutForm.patchValue({
        guestName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phone_number || '',
        cardNumber: user.credit_card || '',
      });
    }
  }

  onConfirmBooking(): void {
    if (this.checkoutForm.valid) {
      //bookingservice to deduce the balance
      this.isBooked = true;
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}

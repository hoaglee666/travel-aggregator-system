import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';

export function matchProfileValidator(fieldType: 'phone' | 'card'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (typeof window === 'undefined' || !window.localStorage) return null;

    const userDataString = localStorage.getItem('user_data');
    if (!userDataString) return null;

    const user = JSON.parse(userDataString);

    // Check multiple common database keys just in case your backend sends them differently
    const expectedPhone = user.phone_number || user.phoneNumber || user.phone;
    const expectedCard = user.credit_card || user.cardNumber || user.card;

    const expectedValue = fieldType === 'phone' ? expectedPhone : expectedCard;

    // If there is no registered value in the profile, skip the check
    if (!expectedValue) return null;

    // VERY IMPORTANT: Convert both values to strings and trim spaces to prevent type mismatch errors!
    const isMatch = String(control.value).trim() === String(expectedValue).trim();

    return isMatch ? null : { profileMismatch: true };
  };
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss'],
})
export class CheckoutComponent implements OnInit {
  hotelId: string = '';
  provider: string = '';
  hotelName: string = '';
  pricePerNight: number = 0;
  totalPrice: number = 0;
  nights: number = 1;
  minDate: string;

  checkoutForm: FormGroup;
  isBooked: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    let registeredPhone = '';
    let registeredCard = '';

    if (typeof window !== 'undefined' && window.localStorage) {
      const userDataString = localStorage.getItem('user_data');
      if (userDataString) {
        const user = JSON.parse(userDataString);
        registeredPhone = user.phone_number || '';
        registeredCard = user.credit_card || '';
      }
    }
    this.checkoutForm = this.fb.group({
      guestName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10,11}$/),
          matchProfileValidator('phone'), // Dynamically checks local storage every keystroke
        ],
      ],
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{16}$/),
          matchProfileValidator('card'), // Dynamically checks local storage every keystroke
        ],
      ],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // 1. Retrieve the guaranteed data from search page
      const pendingStr = localStorage.getItem('pending_booking');
      const pending = pendingStr ? JSON.parse(pendingStr) : {};

      // 2. Safely assign variables (URL first, then fallback to pending)
      this.hotelId = params['hotelId'] || pending.hotelId || '';
      this.provider = params['provider'] || pending.provider || 'Partner Website';
      this.hotelName = params['hotel'] || pending.name || 'Selected Hotel';
      this.pricePerNight = Number(params['price']) || Number(pending.price) || 0;

      const checkIn = params['checkIn'] || pending.checkIn || this.minDate;
      const checkOut = params['checkOut'] || pending.checkOut || '';

      this.checkoutForm.patchValue({
        checkInDate: checkIn,
        checkOutDate: checkOut,
      });

      this.calculateTotal();

      this.checkoutForm.valueChanges.subscribe(() => {
        this.calculateTotal();
      });
    });

    // Auto-fill user info
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

  calculateTotal(): void {
    const checkIn = this.checkoutForm.value.checkInDate;
    const checkOut = this.checkoutForm.value.checkOutDate;

    if (checkIn && checkOut) {
      const ci = new Date(checkIn).getTime();
      const co = new Date(checkOut).getTime();
      this.nights = Math.max(1, Math.ceil((co - ci) / (1000 * 3600 * 24)));
    } else {
      this.nights = 1;
    }
    this.totalPrice = this.pricePerNight * this.nights;
  }

  onConfirmBooking(): void {
    if (this.checkoutForm.valid) {
      this.isBooked = true;
      localStorage.removeItem('pending_booking');

      // 1. Get the current user's email to tag the booking
      const userDataString = localStorage.getItem('user_data');
      const userEmail = userDataString ? JSON.parse(userDataString).email : 'guest';

      const currentBookings = JSON.parse(localStorage.getItem('my_bookings') || '[]');
      currentBookings.push({
        bookingId: 'BKG-' + Math.floor(100000 + Math.random() * 900000),
        userEmail: userEmail, // <-- SECURITY FIX: Tagged to the account!
        hotelId: this.hotelId,
        hotelName: this.hotelName,
        provider: this.provider,
        checkIn: this.checkoutForm.value.checkInDate,
        checkOut: this.checkoutForm.value.checkOutDate,
        pricePerNight: this.pricePerNight,
        nights: this.nights,
        totalPrice: this.totalPrice,
        status: 'Confirmed',
        bookedAt: new Date().toISOString(),
      });
      localStorage.setItem('my_bookings', JSON.stringify(currentBookings));
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}

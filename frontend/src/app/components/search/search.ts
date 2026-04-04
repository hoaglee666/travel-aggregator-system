import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HotelService } from '../../services/hotel';
import { Hotel } from '../../models/hotel.model';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Import ReactiveFormsModule
  templateUrl: './search.html',
  styleUrls: ['./search.scss'],
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  hotels: Hotel[] = [];
  isLoading = false;
  isLoggedIn = false;
  userEmail = '';

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {
    this.searchForm = this.fb.group({
      destination: ['Da Lat'], // Default value
      sort: ['price'], // Default strategy
    });
  }

  ngOnInit(): void {
    // 1. Subscribe to the login status
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;

      // Add the safety check here too!
      if (status && typeof window !== 'undefined' && window.localStorage) {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        this.userEmail = userData.email;
      }
    });

    // 2. Perform initial search
    this.onSubmit();
  }

  onSubmit(): void {
    this.isLoading = true;
    const { destination, sort } = this.searchForm.value;

    this.hotelService.searchAccommodations(destination, sort).subscribe({
      next: (data) => {
        this.hotels = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onTrackPrice(hotel: Hotel): void {
    const suggestedPrice = Math.floor(hotel.price * 0.9);
    const userInput = prompt(
      `Set your target price for ${hotel.name}.\nCurrent price: ${hotel.price} ₫`,
      suggestedPrice.toString(),
    );

    if (userInput) {
      const targetPrice = parseInt(userInput, 10);

      this.hotelService.setPriceAlerts(this.userEmail, hotel.hotelId, targetPrice).subscribe({
        next: (res) => alert(`✅ Success! ${res.message}`),
        error: (err) => alert('❌ Failed to set price alert.'),
      });
    }
  }
}

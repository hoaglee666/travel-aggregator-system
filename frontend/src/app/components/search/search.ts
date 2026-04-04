import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotelService } from '../../services/hotel';
import { Hotel } from '../../models/hotel.model';
import { AuthService } from '../../services/auth';
import { REGION_LIST } from '../../constants/locations';
import { Router } from '@angular/router';

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
  regions = REGION_LIST;

  isAlertModalOpen = false;
  selectedHotel: Hotel | null = null;
  alertForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    this.searchForm = this.fb.group({
      destination: ['Da Lat'], // Default value
      sort: ['price'], // Default strategy
    });

    this.alertForm = this.fb.group({
      targetPrice: [0, [Validators.required, Validators.min(1)]], // <-- Add the inner brackets!
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

  // NEW HELPER: Cures Angular Amnesia!
  checkAuthStatus(): boolean {
    if (this.isLoggedIn) return true; // If Angular remembers, great!

    // If Angular forgot (due to page refresh), check the hard drive
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token') || localStorage.getItem('jwt_token');
      const userData = localStorage.getItem('user_data');

      if (token || userData) {
        this.isLoggedIn = true; // Restore Angular's memory
        return true;
      }
    }
    return false; // Definitely not logged in
  }

  onTrackPrice(hotel: Hotel): void {
    if (!this.checkAuthStatus()) {
      alert('Please log in to track price drops!');
      this.router.navigate(['/login']);
      return;
    }
    console.log('✅ Button clicked! Opening modal for:', hotel.name);

    this.selectedHotel = hotel;
    const suggestedPrice = Math.floor(hotel.price * 0.9); // 10% off
    this.alertForm.patchValue({ targetPrice: suggestedPrice });

    // THE ESCAPE HATCH: Force Angular to process this on the next exact frame
    setTimeout(() => {
      this.isAlertModalOpen = true;
      this.cdr.detectChanges();
    }, 0);
  }

  closeAlertModal(): void {
    this.isAlertModalOpen = false;
    this.selectedHotel = null;
    this.cdr.detectChanges();
  }

  submitPriceAlert(): void {
    if (this.alertForm.invalid || !this.selectedHotel) return;

    const targetPrice = this.alertForm.value.targetPrice;

    this.hotelService
      .setPriceAlerts(this.userEmail, this.selectedHotel.hotelId, targetPrice)
      .subscribe({
        next: (res) => {
          alert(`✅ Success! ${res.message}`); // We can change this to a nice toast later if you want!
          this.closeAlertModal();
        },
        error: (err) => {
          alert('❌ Failed to set price alert.');
          this.closeAlertModal();
        },
      });
  }

  onViewDeal(hotel: Hotel): void {
    if (!this.checkAuthStatus()) {
      alert('Please log in to view affiliate deals!');
      this.router.navigate(['/login']);
      return;
    }
    const currentFrontendUrl = window.location.origin;

    const trackingUrl = `http://localhost:3000/api/redirect?hotelId=${hotel.hotelId}&provider=${hotel.provider}&price=${hotel.price}&name=${encodeURIComponent(hotel.name)}&frontend=${encodeURIComponent(currentFrontendUrl)}`;

    window.open(trackingUrl, '_blank');
  }
}

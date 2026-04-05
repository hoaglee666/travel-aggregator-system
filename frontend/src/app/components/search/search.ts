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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.html',
  // Removed styleUrls if relying purely on Tailwind
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
    // Upgraded form with UI visual fields
    this.searchForm = this.fb.group({
      destination: ['Da Lat'],
      checkIn: [''],
      checkOut: [''],
      guests: ['1'],
      sort: ['price'],
    });

    this.alertForm = this.fb.group({
      targetPrice: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      if (status) {
        const userDataStr = localStorage.getItem('user_data');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          this.userEmail = userData.email;
        }
      }
    });

    // Optional: Load initial data on mount
    // this.onSearch();
  }

  checkAuthStatus(): boolean {
    return this.isLoggedIn;
  }

  onSearch(): void {
    if (this.searchForm.invalid) return;

    this.isLoading = true;
    this.hotels = [];

    // We only send destination and sort to your backend based on your current logic
    const { destination, sort } = this.searchForm.value;

    this.hotelService.searchAccommodations(destination, sort).subscribe({
      next: (res: Hotel[]) => {
        this.hotels = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching hotels:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  openAlertModal(hotel: Hotel): void {
    if (!this.checkAuthStatus()) {
      alert('Please log in to set a price alert!');
      this.router.navigate(['/login']);
      return;
    }

    this.selectedHotel = hotel;
    const suggestedPrice = Math.floor(hotel.price * 0.9);
    this.alertForm.patchValue({ targetPrice: suggestedPrice });

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
          alert(`✅ Success! ${res.message}`);
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

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
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  hotels: Hotel[] = [];
  isLoading = false;
  isLoggedIn = false;
  userEmail = '';
  regions = REGION_LIST;

  minDate: string;
  calculateNights: number = 1;

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
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.searchForm = this.fb.group({
      destination: ['Da Lat'],
      checkIn: [this.minDate],
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
      if (status && typeof window !== 'undefined' && window.localStorage) {
        const userDataStr = localStorage.getItem('user_data');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          this.userEmail = userData.email;
        }
      }
    });
  }

  updateNights(): void {
    const checkIn = this.searchForm.value.checkIn;
    const checkOut = this.searchForm.value.checkOut;

    if (checkIn && checkOut) {
      const ci = new Date(checkIn).getTime();
      const co = new Date(checkOut).getTime();
      this.calculateNights = Math.max(1, Math.ceil((co - ci) / (1000 * 3600 * 24)));
    } else {
      this.calculateNights = 1;
    }
  }

  onSearch(): void {
    if (this.searchForm.invalid) return;
    this.isLoading = true;
    this.updateNights();

    const { destination, sort } = this.searchForm.value;

    this.hotelService.searchAccommodations(destination, sort).subscribe({
      next: (res: Hotel[]) => {
        let fetchedHotels = res;

        // Simulating reduced availability for longer stays
        if (this.calculateNights > 1) {
          fetchedHotels = fetchedHotels.filter((hotel) => {
            let hash = 0;
            for (let i = 0; i < hotel.hotelId.length; i++) {
              hash += hotel.hotelId.charCodeAt(i);
            }
            const dropChance = Math.min(this.calculateNights * 8, 85);
            return hash % 100 >= dropChance;
          });
        }

        // --- NEW: INVENTORY SYNC WITH USER BOOKINGS ---
        const myBookings = JSON.parse(localStorage.getItem('my_bookings') || '[]');

        fetchedHotels = fetchedHotels.map((hotel) => {
          // Check if this specific user has booked this hotel
          const timesBookedByUser = myBookings.filter(
            (b: any) => b.hotelId === hotel.hotelId,
          ).length;

          if (timesBookedByUser > 0) {
            // Deduct the booked rooms from the mock availability
            hotel.roomsLeft = Math.max(0, hotel.roomsLeft - timesBookedByUser);
          }
          return hotel;
        });
        // ----------------------------------------------

        this.hotels = fetchedHotels;
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

  checkAuthStatus(): boolean {
    return this.isLoggedIn;
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
    if (hotel.roomsLeft === 0) {
      alert('Sorry, there are no rooms left for this hotel on these dates.');
      return;
    }
    if (!this.checkAuthStatus()) {
      alert('Please log in to view affiliate deals!');
      this.router.navigate(['/login']);
      return;
    }

    const checkIn = this.searchForm.value.checkIn || '';
    const checkOut = this.searchForm.value.checkOut || '';

    localStorage.setItem(
      'pending_booking',
      JSON.stringify({
        hotelId: hotel.hotelId,
        name: hotel.name,
        provider: hotel.provider,
        price: hotel.price,
        checkIn: checkIn,
        checkOut: checkOut,
      }),
    );

    const currentFrontendUrl = window.location.origin;
    const trackingUrl = `http://localhost:3000/api/redirect?hotelId=${hotel.hotelId}&provider=${hotel.provider}&price=${hotel.price}&name=${encodeURIComponent(hotel.name)}&checkIn=${checkIn}&checkOut=${checkOut}&frontend=${encodeURIComponent(currentFrontendUrl)}`;

    window.open(trackingUrl, '_blank');
  }
}

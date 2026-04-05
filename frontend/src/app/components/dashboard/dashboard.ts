import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotelService } from '../../services/hotel';
import { AuthService } from '../../services/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Added Forms!
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  userEmail: string = '';
  activeTab: 'bookings' | 'alerts' = 'bookings';

  trackedHotels: any[] = [];
  bookedHotels: any[] = [];
  isLoadingAlerts: boolean = true;

  // Edit Modal State
  isEditModalOpen = false;
  selectedBooking: any = null;
  editForm: FormGroup;
  minDate: string;

  isAlertEditModalOpen = false;
  selectedAlert: any = null;
  alertEditForm: FormGroup;

  constructor(
    private hotelService: HotelService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.alertEditForm = this.fb.group({
      targetPrice: [0, [Validators.required, Validators.min(1)]],
    });
    this.editForm = this.fb.group({
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      this.userEmail = userData.email;

      // SECURITY FIX: Fetch all bookings, but ONLY keep the ones matching this email
      const allBookings = JSON.parse(localStorage.getItem('my_bookings') || '[]');
      this.bookedHotels = allBookings.filter((b: any) => b.userEmail === this.userEmail);

      if (this.userEmail) {
        this.fetchMyAlerts();
      } else {
        this.isLoadingAlerts = false;
      }
    }
  }

  setTab(tab: 'bookings' | 'alerts'): void {
    this.activeTab = tab;
  }

  // --- BOOKING MANAGEMENT ---
  cancelBooking(bookingId: string): void {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      // 1. Get the master database
      let allBookings = JSON.parse(localStorage.getItem('my_bookings') || '[]');

      // 2. Remove the specific booking from the master database
      allBookings = allBookings.filter((b: any) => b.bookingId !== bookingId);
      localStorage.setItem('my_bookings', JSON.stringify(allBookings));

      // 3. Update the UI for just this user
      this.bookedHotels = allBookings.filter((b: any) => b.userEmail === this.userEmail);
      this.cdr.detectChanges();
    }
  }

  openEditModal(booking: any): void {
    this.selectedBooking = booking;
    this.editForm.patchValue({
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    });
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedBooking = null;
  }

  saveBookingChanges(): void {
    if (this.editForm.invalid) return;
    const { checkIn, checkOut } = this.editForm.value;

    const ci = new Date(checkIn).getTime();
    const co = new Date(checkOut).getTime();
    const newNights = Math.max(1, Math.ceil((co - ci) / (1000 * 3600 * 24)));

    // 1. Get the master database
    let allBookings = JSON.parse(localStorage.getItem('my_bookings') || '[]');

    // 2. Find and update the specific booking
    const index = allBookings.findIndex((b: any) => b.bookingId === this.selectedBooking.bookingId);
    if (index > -1) {
      allBookings[index].checkIn = checkIn;
      allBookings[index].checkOut = checkOut;
      allBookings[index].nights = newNights;
      allBookings[index].totalPrice = allBookings[index].pricePerNight * newNights;
    }

    // 3. Save the master database and refresh the UI
    localStorage.setItem('my_bookings', JSON.stringify(allBookings));
    this.bookedHotels = allBookings.filter((b: any) => b.userEmail === this.userEmail);

    this.closeEditModal();
    this.cdr.detectChanges();
  }

  openAlertEditModal(alert: any): void {
    this.selectedAlert = alert;
    this.alertEditForm.patchValue({ targetPrice: alert.target_price });
    this.isAlertEditModalOpen = true;
  }

  closeAlertEditModal(): void {
    this.isAlertEditModalOpen = false;
    this.selectedAlert = null;
  }

  saveAlertChanges(): void {
    if (this.alertEditForm.invalid) return;
    const newPrice = this.alertEditForm.value.targetPrice;

    this.hotelService.updateUserAlert(this.selectedAlert.alert_id, newPrice).subscribe({
      next: () => {
        this.fetchMyAlerts(); // Refresh the list
        this.closeAlertEditModal();
      },
      error: () => alert('Failed to update price alert'),
    });
  }

  // --- ALERT MANAGEMENT ---
  fetchMyAlerts(): void {
    this.hotelService.getUserAlerts(this.userEmail).subscribe({
      next: (res) => {
        this.trackedHotels = res.data;
        this.isLoadingAlerts = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoadingAlerts = false;
        this.cdr.detectChanges();
      },
    });
  }

  removeAlert(alertId: number): void {
    if (confirm('Stop tracking this hotel?')) {
      this.hotelService.removeUserAlert(alertId).subscribe({
        next: () => {
          this.trackedHotels = this.trackedHotels.filter((a) => a.alert_id !== alertId);
          this.cdr.detectChanges();
        },
      });
    }
  }
}

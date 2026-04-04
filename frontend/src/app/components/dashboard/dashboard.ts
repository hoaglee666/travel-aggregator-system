import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../services/hotel';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  userEmail: string = '';
  trackedHotels: any[] = [];
  isLoading: boolean = true;

  constructor(
    private hotelService: HotelService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      this.userEmail = userData.email;

      if (this.userEmail) {
        this.fetchMyAlerts();
      } else {
        this.isLoading = false;
      }
    }
  }

  fetchMyAlerts(): void {
    this.hotelService.getUserAlerts(this.userEmail).subscribe({
      next: (res) => {
        this.trackedHotels = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load alerts', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // Add this method inside your DashboardComponent class
  removeAlert(alertId: number): void {
    if (confirm('Are you sure you want to stop tracking this hotel?')) {
      this.hotelService.removeUserAlert(alertId).subscribe({
        next: () => {
          // Instantly remove it from the UI without reloading the page
          this.trackedHotels = this.trackedHotels.filter((a) => a.alert_id !== alertId);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to remove alert', err),
      });
    }
  }
}

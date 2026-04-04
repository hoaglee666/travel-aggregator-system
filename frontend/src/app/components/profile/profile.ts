import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isLoading = true;

  isDepositModalOpen = false;
  customDepositAmount: number = 500000; // Default suggested value

  constructor(
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      if (userData.email) {
        this.profileService.getUserProfile(userData.email).subscribe({
          next: (res) => {
            this.user = res.data;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Profile Load Error:', err),
        });
      }
    }
  }

  openDepositModal(): void {
    this.isDepositModalOpen = true;
    this.cdr.detectChanges();
  }

  closeDepositModal(): void {
    this.isDepositModalOpen = false;
    this.customDepositAmount = 500000; // Reset
    this.cdr.detectChanges();
  }

  confirmDeposit(): void {
    if (this.customDepositAmount <= 0 || this.customDepositAmount > 5000000) return;

    this.profileService.deposit(this.user.email, this.customDepositAmount).subscribe({
      next: () => {
        this.user.balance += this.customDepositAmount;
        alert(`💰 Success! ${this.customDepositAmount.toLocaleString()} ₫ added to your account.`);
        this.closeDepositModal();
      },
      error: (err) => {
        alert('Deposit failed. Please try again.');
        this.closeDepositModal();
      },
    });
  }
}

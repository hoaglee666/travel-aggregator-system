import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ Added ReactiveFormsModule
  templateUrl: './profile.html',
})
export class ProfileComponent implements OnInit {
  user: any = {};
  isLoading = true;

  isEditing = false;
  profileForm: FormGroup;

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      creditCard: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
    });
  }

  ngOnInit(): void {
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    if (userData.email) {
      this.fetchProfile(userData.email);
    } else {
      this.isLoading = false;
    }
  }

  fetchProfile(email: string): void {
    this.profileService.getUserProfile(email).subscribe({
      next: (res) => {
        this.user = res.data;
        this.isLoading = false;

        // Populate the form
        this.profileForm.patchValue({
          fullName: this.user.full_name,
          phoneNumber: this.user.phone_number,
          creditCard: this.user.credit_card,
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    const updatedData = {
      email: this.user.email,
      fullName: this.profileForm.value.fullName,
      phoneNumber: this.profileForm.value.phoneNumber,
      creditCard: this.profileForm.value.creditCard,
    };

    this.profileService.updateProfile(updatedData).subscribe({
      next: () => {
        // Sync local storage so other components (like checkout) get the fresh data
        const localData = JSON.parse(localStorage.getItem('user_data') || '{}');
        localData.fullName = updatedData.fullName;
        localData.phone_number = updatedData.phoneNumber;
        localData.credit_card = updatedData.creditCard;
        localStorage.setItem('user_data', JSON.stringify(localData));

        // Update local UI
        this.user.full_name = updatedData.fullName;
        this.user.phone_number = updatedData.phoneNumber;
        this.user.credit_card = updatedData.creditCard;

        this.isEditing = false;
        this.cdr.detectChanges();
        alert('Profile updated successfully!');
      },
      error: () => alert('Failed to update profile'),
    });
  }
}

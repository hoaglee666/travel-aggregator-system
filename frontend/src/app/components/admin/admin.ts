import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'], // or .css
})
export class AdminComponent implements OnInit {
  logs: string[] = [];
  users: any[] = [];
  isLoading = true;

  adminEmail: string = '';

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      this.adminEmail = userData.email || 'Unknown Admin';
    }
    this.fetchAdminData();
  }

  fetchAdminData(): void {
    // Fetch logs
    this.adminService.getSystemLogs().subscribe({
      next: (res) => {
        this.logs = res.data;
        this.checkLoadingState();
      },
      error: (err) => console.error(err),
    });

    // Fetch users
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.data;
        this.checkLoadingState();
      },
      error: (err) => console.error(err),
    });
  }

  checkLoadingState(): void {
    if (this.logs.length >= 0 && this.users.length >= 0) {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}

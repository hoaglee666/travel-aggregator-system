import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof window !== 'undefined' && window.localStorage) {
    // Check multiple possible keys your auth service might be using
    const token = localStorage.getItem('token') || localStorage.getItem('jwt_token');
    const userData = localStorage.getItem('user_data');

    // If ANY of these exist, the user is logged in
    if (token || userData) {
      return true; // Let them pass!
    }
  }

  // If absolutely nothing is found, bounce them to login
  router.navigate(['/login']);
  return false;
};

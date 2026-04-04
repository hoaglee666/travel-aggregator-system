import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof window !== 'undefined' && window.localStorage) {
    const token = localStorage.getItem('token') || localStorage.getItem('jwt_token');
    const userDataString = localStorage.getItem('user_data');

    // Check if they are logged in using our safer checks
    if (token || userDataString) {
      // They are logged in! Now check if they are the admin
      if (userDataString) {
        const userData = JSON.parse(userDataString);

        if (userData.email === 'admin@gmail.com') {
          return true; // Welcome, Admin!
        } else {
          alert('⛔ ACCESS DENIED: Administrator privileges required.');
          router.navigate(['/dashboard']);
          return false;
        }
      }
    }
  }

  // Not logged in at all
  router.navigate(['/login']);
  return false;
};

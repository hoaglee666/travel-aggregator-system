import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  // Initialize the subject using our strict new check
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasValidSession());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  // --- NEW: Strict Session Verification ---
  private hasValidSession(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('jwt_token');
      const userData = localStorage.getItem('user_data');

      // 1. If BOTH exist, try to parse the user data
      if (token && userData) {
        try {
          JSON.parse(userData); // Will throw an error if data is corrupted
          return true; // Session is perfectly valid!
        } catch (e) {
          console.warn('Corrupted user data found. Forcing logout.');
        }
      }

      // 2. If token exists but no user data (or vice versa/corrupted), clear the ghost session!
      if (token || userData) {
        this.clearStorage();
      }
      return false;
    }
    return false;
  }

  private clearStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
    }
  }
  // ----------------------------------------

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.success && response.token && response.user) {
          localStorage.setItem('jwt_token', response.token);
          localStorage.setItem('user_data', JSON.stringify(response.user));
          this.isLoggedInSubject.next(true);
        }
      }),
    );
  }

  logout(): void {
    this.clearStorage(); // Uses our new helper
    this.isLoggedInSubject.next(false);
  }
}

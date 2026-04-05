import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/api/profile';

  constructor(private http: HttpClient) {}

  // Fetch full user details including balance
  getUserProfile(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${email}`);
  }

  // Update balance
  deposit(email: string, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/deposit`, { email, amount });
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, data);
  }
}

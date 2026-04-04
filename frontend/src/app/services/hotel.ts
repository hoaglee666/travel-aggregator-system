import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Hotel, SearchResponse } from '../models/hotel.model';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  searchAccommodations(destination: string, sort: string): Observable<Hotel[]> {
    const params = new HttpParams().set('destination', destination).set('sort', sort);

    return this.http
      .get<SearchResponse>(`${this.apiUrl}/search`, { params })
      .pipe(map((response) => response.data)); // Extract just the array of hotels
  }

  setPriceAlerts(email: string, hotelId: string, targetPrice: number): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('hotelId', hotelId)
      .set('targetPrice', targetPrice.toString());
    return this.http.get(`${this.apiUrl}/alerts/register`, { params });
  }

  getUserAlerts(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/alerts/user/${email}`);
  }

  removeUserAlert(alertId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/alerts/${alertId}`);
  }
}

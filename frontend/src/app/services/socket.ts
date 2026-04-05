import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

  constructor() {
    // Connect to your backend
    this.socket = io('http://localhost:3000');
  }

  // Called by Checkout page
  emitBooking(hotelId: string): void {
    this.socket.emit('booking_made', { hotelId });
  }

  // Called by Search page
  onInventoryUpdate(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('inventory_update', (data) => {
        observer.next(data);
      });
    });
  }
}

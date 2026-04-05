import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotelService } from '../../services/hotel';
import { Hotel } from '../../models/hotel.model';
import { AuthService } from '../../services/auth';
import { REGION_LIST } from '../../constants/locations';
import { Router } from '@angular/router';
import { SocketService } from '../../services/socket';

// Add this right below your imports!
const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1596470396723-c9fcecac1c7c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1687960117014-f6463f5b419a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1592401703961-731d79e1442f?q=80&w=985&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1677842194404-3268f9e13a52?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1768047845974-a1830dfb186a?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1592555059503-0a774cb8d477?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDZ8fHxlbnwwfHx8fHw%3D',
  'https://plus.unsplash.com/premium_photo-1687960116574-782d09070294?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDh8fHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1682916600891-8ed752584875?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1619676780857-00bc52c93abf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEzfHx8ZW58MHx8fHx8',
  'https://plus.unsplash.com/premium_photo-1687960116802-a9a05891d33f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEyfHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1659559108508-7f6340e45c23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8',
  'https://plus.unsplash.com/premium_photo-1687960116802-a9a05891d33f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEyfHx8ZW58MHx8fHx8',
  'https://plus.unsplash.com/premium_photo-1687960116777-914243ae4799?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE2fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1693332296171-02f689204b4a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1535913989690-f90e1c2d4cfa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1642371594014-b82c20ba4f50?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE4fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1743260617827-e9d240bf9c21?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8',
  'https://plus.unsplash.com/premium_photo-1675745329954-9639d3b74bbf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1768047846080-d477e260ff00?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIyfHx8ZW58MHx8fHx8',
  'https://plus.unsplash.com/premium_photo-1687960116553-52e1b0cbb071?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI0fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1537823286324-7d070255022e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIzfHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1768047846080-d477e260ff00?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIyfHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1715158230572-f571ba4952da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI2fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1774280954999-9758f11f3d41?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI1fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1644780400698-9bc37aa131a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI3fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1644434090351-ea8cdce23213?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI5fHx8ZW58MHx8fHx8',
  'https://plus.unsplash.com/premium_photo-1675745330148-1f7e5a7674a5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI4fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1760942966693-e5db8bf90060?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDMwfHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1489475344893-ca9e2e8eebbc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDMxfHx8ZW58MHx8fHx8',
  'https://plus.unsplash.com/premium_photo-1681922761181-ee59fa91edc7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDMyfHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1644813948290-7f43b8b8a98a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDMzfHx8ZW58MHx8fHx8',
  'https://plus.unsplash.com/premium_photo-1681922761181-ee59fa91edc7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDMyfHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1737531049186-a20c1f203f50?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM1fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1733712999156-52256962d51d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM0fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1737531049186-a20c1f203f50?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM1fHx8ZW58MHx8fHx8',
  'https://plus.unsplash.com/premium_photo-1682285211680-8fbd6b44aaef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM2fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1762778487706-9835a21b5c45?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM3fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1743356174397-d6da6f014f8f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM4fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1620898670223-6f7f07d82a3b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM5fHx8ZW58MHx8fHx8',
  'https://plus.unsplash.com/premium_photo-1661964225206-fd5d445a6edd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQwfHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1551628335-d9861f3b05ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQyfHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1585544314652-255f5fd711d3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQxfHx8ZW58MHx8fHx8',
  'https://plus.unsplash.com/premium_photo-1750044767122-61f613ae677a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQ0fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1719704266649-d087267d0b82?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQ1fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1733253870993-49646c55bbda?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQ2fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1564966403331-b34bc054483e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQ3fHx8ZW58MHx8fHx8',
  'https://plus.unsplash.com/premium_photo-1682285212027-6af0d0f70e07?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQ4fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1760067537640-6ffab10b27d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQ5fHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1659559108246-a9b30f5091b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDUwfHx8ZW58MHx8fHx8',
  'https://images.unsplash.com/photo-1614506660579-c6c478e2f349?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fHw%3D',
  'https://images.unsplash.com/photo-1579126808407-f17e77a46d5b?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1675745329954-9639d3b74bbf?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1551882547-ff40c6658156?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1501117716987-c8c394bb29df?auto=format&fit=crop&q=80&w=800',
];

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.html',
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  hotels: Hotel[] = [];
  isLoading = false;
  isLoggedIn = false;
  userEmail = '';
  regions = REGION_LIST;

  minDate: string;
  calculateNights: number = 1;

  isAlertModalOpen = false;
  selectedHotel: Hotel | null = null;
  alertForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private socketService: SocketService,
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.searchForm = this.fb.group({
      destination: ['Da Lat'],
      checkIn: [this.minDate],
      checkOut: [''],
      guests: ['1'],
      sort: ['price'],
    });

    this.alertForm = this.fb.group({
      targetPrice: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      if (status && typeof window !== 'undefined' && window.localStorage) {
        const userDataStr = localStorage.getItem('user_data');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          this.userEmail = userData.email;
        }
      }
    });
    this.socketService.onInventoryUpdate().subscribe((data) => {
      console.log('Real-time update received!', data);

      // Find the hotel in our master list and deduct a room
      const hotel = this.hotels.find((h) => h.hotelId === data.hotelId);
      if (hotel && hotel.roomsLeft > 0) {
        hotel.roomsLeft -= 1;

        // Refresh the current page to show the new number!
        this.updatePagination();
      }
    });
  }

  updateNights(): void {
    const checkIn = this.searchForm.value.checkIn;
    const checkOut = this.searchForm.value.checkOut;

    if (checkIn && checkOut) {
      const ci = new Date(checkIn).getTime();
      const co = new Date(checkOut).getTime();
      this.calculateNights = Math.max(1, Math.ceil((co - ci) / (1000 * 3600 * 24)));
    } else {
      this.calculateNights = 1;
    }
  }

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  paginatedHotels: Hotel[] = [];

  onSearch(): void {
    if (this.searchForm.invalid) return;
    this.isLoading = true;
    this.updateNights();

    const { destination, sort } = this.searchForm.value;

    this.hotelService.searchAccommodations(destination, sort).subscribe({
      next: (res: Hotel[]) => {
        let fetchedHotels = res;

        // Simulating reduced availability for longer stays
        if (this.calculateNights > 1) {
          fetchedHotels = fetchedHotels.filter((hotel) => {
            let hash = 0;
            for (let i = 0; i < hotel.hotelId.length; i++) {
              hash += hotel.hotelId.charCodeAt(i);
            }
            const dropChance = Math.min(this.calculateNights * 8, 85);
            return hash % 100 >= dropChance;
          });
        }

        fetchedHotels = fetchedHotels.map((hotel, index) => {
          // Rank 0 gets Image 0, Rank 1 gets Image 1... Rank 40 loops back to Image 0!
          hotel.imageUrl = HOTEL_IMAGES[index % HOTEL_IMAGES.length];
          return hotel;
        });

        this.hotels = fetchedHotels;
        this.currentPage = 1;
        this.updatePagination();

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching hotels:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
  updatePagination(): void {
    this.totalPages = Math.ceil(this.hotels.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // Slice the master array to get just the 10 for this page
    this.paginatedHotels = this.hotels.slice(startIndex, endIndex);
    this.cdr.detectChanges();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      // Smooth scroll back to the top of the results
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }

  checkAuthStatus(): boolean {
    return this.isLoggedIn;
  }

  openAlertModal(hotel: Hotel): void {
    if (!this.checkAuthStatus()) {
      alert('Please log in to set a price alert!');
      this.router.navigate(['/login']);
      return;
    }
    this.selectedHotel = hotel;
    const suggestedPrice = Math.floor(hotel.price * 0.9);
    this.alertForm.patchValue({ targetPrice: suggestedPrice });
    setTimeout(() => {
      this.isAlertModalOpen = true;
      this.cdr.detectChanges();
    }, 0);
  }

  closeAlertModal(): void {
    this.isAlertModalOpen = false;
    this.selectedHotel = null;
    this.cdr.detectChanges();
  }

  submitPriceAlert(): void {
    if (this.alertForm.invalid || !this.selectedHotel) return;
    const targetPrice = this.alertForm.value.targetPrice;
    this.hotelService
      .setPriceAlerts(this.userEmail, this.selectedHotel.hotelId, targetPrice)
      .subscribe({
        next: (res) => {
          alert(`✅ Success! ${res.message}`);
          this.closeAlertModal();
        },
        error: (err) => {
          alert('❌ Failed to set price alert.');
          this.closeAlertModal();
        },
      });
  }

  onViewDeal(hotel: Hotel): void {
    if (hotel.roomsLeft === 0) {
      alert('Sorry, there are no rooms left for this hotel on these dates.');
      return;
    }
    if (!this.checkAuthStatus()) {
      alert('Please log in to view affiliate deals!');
      this.router.navigate(['/login']);
      return;
    }

    const checkIn = this.searchForm.value.checkIn || '';
    const checkOut = this.searchForm.value.checkOut || '';

    localStorage.setItem(
      'pending_booking',
      JSON.stringify({
        hotelId: hotel.hotelId,
        name: hotel.name,
        provider: hotel.provider,
        price: hotel.price,
        checkIn: checkIn,
        checkOut: checkOut,
      }),
    );

    const currentFrontendUrl = window.location.origin;
    const trackingUrl = `http://localhost:3000/api/redirect?hotelId=${hotel.hotelId}&provider=${hotel.provider}&price=${hotel.price}&name=${encodeURIComponent(hotel.name)}&checkIn=${checkIn}&checkOut=${checkOut}&frontend=${encodeURIComponent(currentFrontendUrl)}`;

    window.open(trackingUrl, '_blank');
  }
}

export interface Hotel {
  hotelId: string;
  name: string;
  destination: string;
  rating: number;
  price: number;
  provider: string; // The backend uses 'provider' (Agoda, Expedia, etc.)
  imageUrl?: string; // Added for the UI
  bookingUrl?: string; // Added for the affiliate redirect logic

  roomsLeft: number;
  maxOccupancy: number;
  bedType: string;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  isAvailable: boolean;
  payAtProperty: boolean;
  roomType: string;
  availableFrom: string;
  remainingAllot: number;
  noPrePay: boolean;
  instantConfirm: boolean;
  refundAvail: boolean;
  memberDiscount: boolean;
  checkinTime: string;
  checkoutTime: string;
  loyaltyP: number;
  stockStatus: string;
}

export interface SearchResponse {
  success: boolean;
  totalResults: number;
  data: Hotel[];
}

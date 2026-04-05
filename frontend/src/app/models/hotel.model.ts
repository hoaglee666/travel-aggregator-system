export interface Hotel {
  hotelId: string;
  name: string;
  destination: string;
  rating: number;
  price: number;
  provider: string; // The backend uses 'provider' (Agoda, Expedia, etc.)
  imageUrl?: string; // Added for the UI
  bookingUrl?: string; // Added for the affiliate redirect logic
}

export interface SearchResponse {
  success: boolean;
  totalResults: number;
  data: Hotel[];
}

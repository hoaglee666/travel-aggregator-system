// This is our system's universal standard.
// Every partner's data MUST be converted into this format.
export interface StandardHotel {
  hotelId: string;
  name: string;
  destination: string;
  rating: number;
  price: number;
  provider: string; // The backend uses 'provider' (Agoda, Expedia, etc.)
  imageUrl?: string; // Added for the UI
  bookingUrl?: string; // Added for the affiliate redirect logic
}

// The core Adapter interface that all partner adapters must implement
export interface IHotelAPIAdapter {
  fetchAndStandardize(
    destination: string,
    checkIn: string,
    checkOut: string,
  ): Promise<StandardHotel[]>;
}

// This is our system's universal standard.
// Every partner's data MUST be converted into this format.
export interface StandardHotel {
  hotelId: string;
  name: string;
  destination: string;
  rating: number;
  price: number;
  provider: string; // e.g., 'Agoda' or 'Expedia'
}

// The core Adapter interface that all partner adapters must implement
export interface IHotelAPIAdapter {
  fetchAndStandardize(
    destination: string,
    checkIn: string,
    checkOut: string,
  ): Promise<StandardHotel[]>;
}

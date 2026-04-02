export interface Hotel {
  hotelId: string;
  name: string;
  destination: string;
  rating: number;
  price: number;
  provider: string;
}

export interface SearchResponse {
  success: boolean;
  totalResults: number;
  data: Hotel[];
}

import { IHotelAPIAdapter, StandardHotel } from "../interfaces/Hotel";
import { MockTripAPI } from "../services/MockTripAPI";

export class TripAdapter implements IHotelAPIAdapter {
  private api = new MockTripAPI();
  private readonly USD_TO_VND = 25000;

  public async fetchAndStandardize(
    destination: string,
    checkIn: string,
    checkOut: string,
  ): Promise<StandardHotel[]> {
    const rawData = await this.api.getTripHotels(destination);
    return rawData.map((item: any) => ({
      hotelId: item.trip_id,
      name: item.name,
      destination: item.location.city,
      rating: parseFloat(item.review_score),
      price: item.price_usd * this.USD_TO_VND,
      provider: "Trip.com",
    }));
  }
}

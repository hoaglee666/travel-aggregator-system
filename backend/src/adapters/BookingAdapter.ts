import { IHotelAPIAdapter, StandardHotel } from "../interfaces/Hotel";
import { MockBookingAPI } from "../services/MockBookingAPI";

export class BookingAdapter implements IHotelAPIAdapter {
  private api = new MockBookingAPI();
  public async fetchAndStandardize(
    destination: string,
    checkIn: string,
    checkOut: string,
  ): Promise<StandardHotel[]> {
    const rawData = await this.api.getBookingHotels(destination);
    return rawData.map((item: any) => ({
      hotelId: item.b_id,
      name: item.hotel_info.name,
      destination: item.hotel_info.city,
      rating: item.hotel_info.stars,
      price: item.price_data.amount_vnd,
      provider: "Booking.com",
    }));
  }
}

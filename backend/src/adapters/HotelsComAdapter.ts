import { IHotelAPIAdapter, StandardHotel } from "../interfaces/Hotel";
import { MockHotelsComAPI } from "../services/MockHotelsComAPI";

export class HotelsComAdapter implements IHotelAPIAdapter {
  private api = new MockHotelsComAPI();

  public async fetchAndStandardize(
    destination: string,
    checkIn: string,
    checkOut: string,
  ): Promise<StandardHotel[]> {
    const rawData = await this.api.getHotelsComHotels(destination);
    return rawData.map((item: any) => ({
      hotelId: item.id,
      name: item.property_details.name,
      destination: item.property_details.city,
      rating: parseFloat(item.property_details.rating_out_of_10) / 2, // Scale 10 down to 5
      price: item.rate.price_vnd,
      provider: "Hotels.com",
    }));
  }
}

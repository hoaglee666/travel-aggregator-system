import { IHotelAPIAdapter, StandardHotel } from "../interfaces/Hotel";
import { MockAgodaAPI } from "../services/MockAgodaAPI";

export class AgodaAdapter implements IHotelAPIAdapter {
  private api: MockAgodaAPI;

  constructor() {
    this.api = new MockAgodaAPI();
  }

  public async fetchAndStandardize(
    destination: string,
    checkIn: string,
    checkOut: string,
  ): Promise<StandardHotel[]> {
    const rawData = await this.api.getAgodaHotels(destination);

    // Translate Agoda's flat format into our Standard format
    return rawData.map((item: any) => ({
      hotelId: item.agoda_id,
      name: item.property_name,
      destination: item.location,
      rating: item.star_rating,
      price: item.nightly_rate_vnd,
      provider: "Agoda",
    }));
  }
}

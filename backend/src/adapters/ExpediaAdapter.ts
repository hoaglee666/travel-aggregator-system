import { IHotelAPIAdapter, StandardHotel } from "../interfaces/Hotel";
import { MockExpediaAPI } from "../services/MockExpediaAPI";

export class ExpediaAdapter implements IHotelAPIAdapter {
  private api: MockExpediaAPI;
  private readonly USD_TO_VND_RATE = 25000; // Mock conversion rate

  constructor() {
    this.api = new MockExpediaAPI();
  }

  public async fetchAndStandardize(
    destination: string,
    checkIn: string,
    checkOut: string,
  ): Promise<StandardHotel[]> {
    const rawResponse = await this.api.fetchExpediaProperties(destination);
    const rawProperties = rawResponse.data.properties;

    // Translate Expedia's nested format, convert USD to VND, and scale rating from /10 to /5
    return rawProperties.map((item: any) => ({
      hotelId: item.internalCode,
      name: item.details.title,
      destination: item.details.city,
      rating: item.details.userScore / 2, // Convert 9.2/10 to 4.6/5
      price: item.financials.price_usd * this.USD_TO_VND_RATE,
      provider: "Expedia",
    }));
  }
}

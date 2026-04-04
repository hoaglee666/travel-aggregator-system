import { MockDataGenerator } from "../utils/MockDataGenerator";

export class MockHotelsComAPI {
  // Generates about 125 hotels instantly when the server starts!
  private hotelsComDatabase = MockDataGenerator.generateHotelsComDatabase();

  public async getHotelsComHotels(city: string): Promise<any[]> {
    console.log(`[Network] Fetching HotelsCombined data for ${city}...`);
    await new Promise((resolve) => setTimeout(resolve, 300)); // Lowered delay for better UX

    return this.hotelsComDatabase.filter((hotel) =>
      hotel.property_details.city.toLowerCase().includes(city.toLowerCase()),
    );
  }
}

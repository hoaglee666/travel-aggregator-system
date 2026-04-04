import { MockDataGenerator } from "../utils/MockDataGenerator";

export class MockTripAPI {
  // Generates about 125 hotels instantly when the server starts!
  private tripDatabase = MockDataGenerator.generateTripDatabase();

  public async getTripHotels(city: string): Promise<any[]> {
    console.log(`[Network] Fetching Trip data for ${city}...`);
    await new Promise((resolve) => setTimeout(resolve, 300)); // Lowered delay for better UX

    return this.tripDatabase.filter((hotel) =>
      hotel.location.city.toLowerCase().includes(city.toLowerCase()),
    );
  }
}

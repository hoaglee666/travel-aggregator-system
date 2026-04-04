import { MockDataGenerator } from "../utils/MockDataGenerator";

export class MockAgodaAPI {
  // Generates about 125 hotels instantly when the server starts!
  private agodaDatabase = MockDataGenerator.generateAgodaDatabase();

  public async getAgodaHotels(city: string): Promise<any[]> {
    console.log(`[Network] Fetching Agoda data for ${city}...`);
    await new Promise((resolve) => setTimeout(resolve, 300)); // Lowered delay for better UX

    return this.agodaDatabase.filter((hotel) =>
      hotel.location.toLowerCase().includes(city.toLowerCase()),
    );
  }
}

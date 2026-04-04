import { MockDataGenerator } from "../utils/MockDataGenerator";

export class MockBookingAPI {
  // Generates about 125 hotels instantly when the server starts!
  private bookingDatabase = MockDataGenerator.generateBookingDatabase();

  public async getBookingHotels(city: string): Promise<any[]> {
    console.log(`[Network] Fetching Booking data for ${city}...`);
    await new Promise((resolve) => setTimeout(resolve, 300)); // Lowered delay for better UX

    return this.bookingDatabase.filter((hotel) =>
      hotel.hotel_info.city.toLowerCase().includes(city.toLowerCase()),
    );
  }
}

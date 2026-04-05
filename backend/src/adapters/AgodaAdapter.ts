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
      rating: parseFloat(item.star_rating),
      price: item.nightly_rate_vnd,
      provider: "Agoda",
      roomsLeft: item.availability.rooms_left,
      maxOccupancy: Math.floor(Math.random() * 3) + 2, // Mock: 2-4 people
      bedType: ["1 King Bed", "2 Twin Beds", "1 Queen Bed"][
        Math.floor(Math.random() * 3)
      ], // Mock bed type
      freeCancellation: item.availability.free_cancellation,
      breakfastIncluded: item.availability.breakfast_included,
      isAvailable: true, // Mock: assume available
      payAtProperty: Math.random() > 0.7, // Mock: 30% chance
      roomType: "Standard Room", // Mock
      availableFrom: checkIn, // Use check-in date
      remainingAllot: item.availability.rooms_left,
      noPrePay: Math.random() > 0.5, // Mock
      instantConfirm: Math.random() > 0.3, // Mock: 70% chance
      refundAvail: item.availability.free_cancellation,
      memberDiscount: Math.random() > 0.8, // Mock: 20% chance
      checkinTime: "14:00", // Mock standard time
      checkoutTime: "12:00", // Mock standard time
      loyaltyP: Math.floor(Math.random() * 1000), // Mock points
      stockStatus: "Available", // Mock
    }));
  }
}

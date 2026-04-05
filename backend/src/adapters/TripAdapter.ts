import { IHotelAPIAdapter, StandardHotel } from "../interfaces/Hotel";
import { MockTripAPI } from "../services/MockTripAPI";

export class TripAdapter implements IHotelAPIAdapter {
  private api: MockTripAPI;

  constructor() {
    this.api = new MockTripAPI();
  }

  public async fetchAndStandardize(
    destination: string,
    checkIn: string,
    checkOut: string,
  ): Promise<StandardHotel[]> {
    const rawData = await this.api.getTripHotels(destination);

    return rawData.map((item: any) => ({
      hotelId: item.trip_id,
      name: item.name,
      destination: item.location?.city || destination,
      rating: parseFloat(item.review_score || "3.5"),
      price: (item.price_usd || 100) * 25000,
      provider: "Trip.com",

      // Map Trip's specific fields
      roomsLeft: Math.floor(Math.random() * 5) + 1, // Fallback
      maxOccupancy: 2,
      bedType: "Standard Room",
      freeCancellation: item.booking_conditions?.refundable || false,

      // Defaults
      breakfastIncluded: false,
      isAvailable: true,
      payAtProperty: false,
      roomType: "Standard Room",
      availableFrom: checkIn,
      remainingAllot: 1,
      noPrePay: false,
      instantConfirm: item.booking_conditions?.instant_confirmation || true,
      refundAvail: item.booking_conditions?.refundable || false,
      memberDiscount: item.booking_conditions?.member_discount_applied || false,
      checkinTime: "14:00",
      checkoutTime: "12:00",
      loyaltyP: 0,
      stockStatus: "AVAILABLE",
    }));
  }
}

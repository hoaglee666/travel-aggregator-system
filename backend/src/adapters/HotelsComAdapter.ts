import { IHotelAPIAdapter, StandardHotel } from "../interfaces/Hotel";
import { MockHotelsComAPI } from "../services/MockHotelsComAPI";

export class HotelsComAdapter implements IHotelAPIAdapter {
  private api: MockHotelsComAPI;

  constructor() {
    this.api = new MockHotelsComAPI();
  }

  public async fetchAndStandardize(
    destination: string,
    checkIn: string,
    checkOut: string,
  ): Promise<StandardHotel[]> {
    const rawData = await this.api.getHotelsComHotels(destination);

    return rawData.map((item: any) => ({
      hotelId: item.id,
      name: item.property_details?.name || "Unknown Hotel",
      destination: item.property_details?.city || destination,
      rating: parseFloat(item.property_details?.rating_out_of_10 || "7.0") / 2,
      price: item.rate?.price_vnd || 1000000,
      provider: "Hotels.com",

      // Map Hotels.com specific fields
      roomsLeft: Math.floor(Math.random() * 5) + 1,
      maxOccupancy: 2,
      bedType: "Standard Room",
      freeCancellation: false,

      // Defaults
      breakfastIncluded: false,
      isAvailable: true,
      payAtProperty: false,
      roomType: "Standard Room",
      availableFrom: checkIn,
      remainingAllot: 1,
      noPrePay: false,
      instantConfirm: true,
      refundAvail: false,
      memberDiscount: false,
      checkinTime: item.logistics?.check_in_time || "14:00",
      checkoutTime: item.logistics?.check_out_time || "12:00",
      loyaltyP: item.logistics?.loyalty_points_earned || 0,
      stockStatus: item.logistics?.stock_status || "AVAILABLE",
    }));
  }
}

import { IHotelAPIAdapter, StandardHotel } from "../interfaces/Hotel";
import { MockExpediaAPI } from "../services/MockExpediaAPI";

export class ExpediaAdapter implements IHotelAPIAdapter {
  private api: MockExpediaAPI;

  constructor() {
    this.api = new MockExpediaAPI();
  }

  public async fetchAndStandardize(
    destination: string,
    checkIn: string,
    checkOut: string,
  ): Promise<StandardHotel[]> {
    const response = await this.api.fetchExpediaProperties(destination);
    const rawData = response.data.properties; // Note: verify the method name in your MockExpediaAPI

    return rawData.map((item: any) => ({
      hotelId: item.internalCode,
      name: item.details?.title || "Unknown Hotel",
      destination: item.details?.city || destination,
      // Expedia is out of 10, so we divide by 2 for a 5-star standard
      rating: parseFloat(item.details?.userScore || "6.0") / 2,
      price: (item.financials?.price_usd || 100) * 25000,
      provider: "Expedia",

      // Map Expedia's specific fields
      roomsLeft:
        item.inventory?.rooms_remaining || Math.floor(Math.random() * 5) + 1,
      maxOccupancy: item.inventory?.max_occupancy || 2,
      bedType: item.inventory?.bed_configuration || "Standard Room",
      freeCancellation: item.inventory?.refundable || false,

      // Defaults
      breakfastIncluded: false,
      isAvailable: item.inventory?.is_available || true,
      payAtProperty: item.inventory?.pay_at_property || false,
      roomType: "Standard Room",
      availableFrom: checkIn,
      remainingAllot: item.inventory?.rooms_remaining || 1,
      noPrePay: false,
      instantConfirm: true,
      refundAvail: item.inventory?.refundable || false,
      memberDiscount: false,
      checkinTime: "15:00",
      checkoutTime: "11:00",
      loyaltyP: 0,
      stockStatus: "AVAILABLE",
    }));
  }
}

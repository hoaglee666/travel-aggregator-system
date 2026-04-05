import { IHotelAPIAdapter, StandardHotel } from "../interfaces/Hotel";
import { MockBookingAPI } from "../services/MockBookingAPI";

export class BookingAdapter implements IHotelAPIAdapter {
  private api: MockBookingAPI;

  constructor() {
    this.api = new MockBookingAPI();
  }

  public async fetchAndStandardize(
    destination: string,
    checkIn: string,
    checkOut: string,
  ): Promise<StandardHotel[]> {
    const rawData = await this.api.getBookingHotels(destination);

    return rawData.map((item: any) => ({
      hotelId: item.b_id,
      name: item.hotel_info?.name || "Unknown Hotel",
      destination: item.hotel_info?.city || destination,
      rating: item.hotel_info?.stars || 3,
      price: item.price_data?.amount_vnd || 1000000,
      provider: "Booking.com",

      // Map Booking.com's specific fields
      roomsLeft:
        item.room_details?.remaining_allotment ||
        Math.floor(Math.random() * 5) + 1,
      maxOccupancy: item.room_details?.guest_limit || 2,
      bedType: item.room_details?.bed_setup || "Standard Double Room",
      freeCancellation: item.room_details?.free_cancel || false,

      // Defaults to satisfy the StandardHotel interface
      breakfastIncluded: Math.random() > 0.5,
      isAvailable: true,
      payAtProperty: Math.random() > 0.6,
      roomType: item.room_details?.room_type || "Standard Room",
      availableFrom: item.room_details?.available_from || checkIn,
      remainingAllot: item.room_details?.remaining_allotment || 1,
      noPrePay: item.room_details?.no_prepayment_needed || false,
      instantConfirm: true,
      refundAvail: item.room_details?.free_cancel || false,
      memberDiscount: false,
      checkinTime: "14:00",
      checkoutTime: "12:00",
      loyaltyP: Math.floor(Math.random() * 500),
      stockStatus: "AVAILABLE",
    }));
  }
}

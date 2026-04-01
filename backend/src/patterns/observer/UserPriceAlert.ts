import { IObserver } from "./IObserver";
import { SystemHealthLogger } from "../../utils/SystemHealthLogger";

export class UserPriceAlert implements IObserver {
  constructor(
    public userEmail: string,
    public targetHotelId: string,
    public targetPrice: number,
  ) {}

  public update(hotelId: string, newPrice: number): void {
    // Only trigger if this is the exact hotel and the price is below their target
    if (hotelId === this.targetHotelId && newPrice <= this.targetPrice) {
      const logger = SystemHealthLogger.getInstance(); // Using our Singleton!
      logger.logInfo(
        `📧 [EMAIL SENT] To: ${this.userEmail} | Good news! Hotel ${hotelId} dropped to ${newPrice} VND!`,
      );
    }
  }
}

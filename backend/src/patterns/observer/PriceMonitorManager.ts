import { ISubject } from "./ISubject";
import { IObserver } from "./IObserver";
import { SystemHealthLogger } from "../../utils/SystemHealthLogger";

export class PriceMonitorManager implements ISubject {
  private observers: IObserver[] = [];
  private logger = SystemHealthLogger.getInstance();

  public attach(observer: IObserver): void {
    this.observers.push(observer);
    this.logger.logInfo(`[Observer] New Price Alert registered.`);
  }

  public detach(observer: IObserver): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  public notify(hotelId: string, newPrice: number): void {
    this.logger.logInfo(
      `[Subject] Price change detected for ${hotelId}: ${newPrice} VND. Checking alerts...`,
    );
    for (const observer of this.observers) {
      observer.update(hotelId, newPrice);
    }
  }

  // A helper method to simulate a background system finding a new cheap price
  public simulatePriceDrop(hotelId: string, newPrice: number) {
    this.notify(hotelId, newPrice);
  }
}

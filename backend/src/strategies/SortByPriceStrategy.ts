import { ISortStrategy } from "./ISortStrategy";
import { StandardHotel } from "../interfaces/Hotel";

export class SortByPriceStrategy implements ISortStrategy {
  public sort(hotels: StandardHotel[]): StandardHotel[] {
    console.log("[Strategy] Sorting by Lowest Price");
    // Sort ascending (lowest price first)
    return hotels.sort((a, b) => a.price - b.price);
  }
}

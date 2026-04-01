import { ISortStrategy } from "./ISortStrategy";
import { StandardHotel } from "../interfaces/Hotel";

export class SortByRatingStrategy implements ISortStrategy {
  public sort(hotels: StandardHotel[]): StandardHotel[] {
    console.log("[Strategy] Sorting by Highest Rating");
    // Sort descending (highest rating first)
    return hotels.sort((a, b) => b.rating - a.rating);
  }
}

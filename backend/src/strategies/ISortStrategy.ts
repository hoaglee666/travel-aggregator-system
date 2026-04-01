import { StandardHotel } from "../interfaces/Hotel";

export interface ISortStrategy {
  sort(hotels: StandardHotel[]): StandardHotel[];
}

// src/patterns/observer/IObserver.ts
export interface IObserver {
  update(hotelId: string, newPrice: number): void;
}

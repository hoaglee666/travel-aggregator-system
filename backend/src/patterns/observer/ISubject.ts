// src/patterns/observer/ISubject.ts
import { IObserver } from "./IObserver";

export interface ISubject {
  attach(observer: IObserver): void;
  detach(observer: IObserver): void;
  notify(hotelId: string, newPrice: number): void;
}

import { IHotelAPIAdapter, StandardHotel } from "../interfaces/Hotel";
import { AgodaAdapter } from "../adapters/AgodaAdapter";
import { ExpediaAdapter } from "../adapters/ExpediaAdapter";
import { ISortStrategy } from "../strategies/ISortStrategy";
import { SortByPriceStrategy } from "../strategies/SortByPriceStrategy";
export class AggregatorFacade {
  private adapters: IHotelAPIAdapter[] = [];
  private sortStrategy: ISortStrategy;

  constructor() {
    this.adapters.push(new AgodaAdapter());
    this.adapters.push(new ExpediaAdapter());

    this.sortStrategy = new SortByPriceStrategy();
  }

  public setSortStrategy(strategy: ISortStrategy) {
    this.sortStrategy = strategy;
  }

  public async searchAccommodations(
    destination: string,
    checkIn: string,
    checkOut: string,
  ): Promise<StandardHotel[]> {
    console.log(`[Facade] Initiating concurrent search for: ${destination}`);

    // 1. Ask all registered adapters to fetch data at the exact same time
    const searchPromises = this.adapters.map((adapter) =>
      adapter.fetchAndStandardize(destination, checkIn, checkOut),
    );

    // 2. Wait for all of them to finish
    const resultsArray = await Promise.all(searchPromises);

    // 3. Flatten the array of arrays into a single list of StandardHotels
    let allHotels: StandardHotel[] = resultsArray.flat();

    // 4. Default Sorting Strategy: Sort by lowest price first
    allHotels = this.sortStrategy.sort(allHotels);
    console.log(`[Facade] Successfully aggregated ${allHotels.length} hotels.`);
    return allHotels;
  }
}

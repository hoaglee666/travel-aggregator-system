import { Request, Response } from "express";
import { AggregatorFacade } from "../facades/AggregatorFacade";
import { SortByPriceStrategy } from "../strategies/SortByPriceStrategy";
import { SortByRatingStrategy } from "../strategies/SortByRatingStrategy";
// Instantiate the Facade once
const aggregatorFacade = new AggregatorFacade();

export const searchHotels = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Extract query parameters from the frontend request (with defaults for testing)
    const destination = (req.query.destination as string) || "Da Lat";
    const checkIn = (req.query.checkIn as string) || "2026-04-10";
    const checkOut = (req.query.checkOut as string) || "2026-04-12";
    const sortParam = (req.query.sort as string) || "price";

    if (sortParam == "rating") {
      aggregatorFacade.setSortStrategy(new SortByRatingStrategy());
    } else {
      aggregatorFacade.setSortStrategy(new SortByPriceStrategy());
    }

    // Hand the request off to the Facade
    const results = await aggregatorFacade.searchAccommodations(
      destination,
      checkIn,
      checkOut,
    );

    // Return the clean, standardized JSON to the Angular frontend
    res.status(200).json({
      success: true,
      totalResults: results.length,
      data: results,
    });
  } catch (error) {
    console.error("[Controller] Error during search:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error while aggregating data",
    });
  }
};

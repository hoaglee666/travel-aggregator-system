import { Request, Response } from "express";
import { SystemHealthLogger } from "../utils/SystemHealthLogger";

const logger = SystemHealthLogger.getInstance();

export const trackAndRedirect = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const hotelId = req.query.hotelId as string;
    const provider = req.query.provider as string;
    const price = req.query.price as string;
    const name = req.query.name as string;

    const frontendUrl =
      (req.query.frontend as string) || "http://localhost:4200";
    // 1. Log the outbound click for Affiliate Analytics (Using our Singleton!)
    logger.logInfo(
      `[AFFILIATE TRACKING] Outbound click to ${provider} | Hotel ID: ${hotelId} | Price: ${price} VND`,
    );

    const partnerUrl = `${frontendUrl}/checkout?provider=${encodeURIComponent(provider)}&hotel=${encodeURIComponent(name)}&price=${price}`;

    // 2. Determine the partner's base URL
    // let partnerUrl = "";
    // switch (provider.toLowerCase()) {
    //   case "agoda":
    //     partnerUrl = `https://www.agoda.com/search?text=${hotelId}`;
    //     break;
    //   case "expedia":
    //     partnerUrl = `https://www.expedia.com/Hotel-Search?destination=${hotelId}`;
    //     break;
    //   case "booking.com":
    //     partnerUrl = `https://www.booking.com/searchresults.html?ss=${hotelId}`;
    //     break;
    //   case "trip.com":
    //     partnerUrl = `https://www.trip.com/hotels/search/?keyword=${hotelId}`;
    //     break;
    //   case "hotels.com":
    //     partnerUrl = `https://www.hotels.com/search.do?q-destination=${hotelId}`;
    //     break;
    //   default:
    //     partnerUrl = `https://www.google.com/search?q=${hotelId}+hotel`;
    // }

    // 3. Issue an HTTP 302 Redirect to instantly bounce the user to the partner site
    res.redirect(302, partnerUrl);
  } catch (error) {
    logger.logError("Failed to process redirect", error);
    res.status(500).send("Redirect failed");
  }
};

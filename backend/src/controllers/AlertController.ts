import { Request, Response } from "express";
import { PriceMonitorManager } from "../patterns/observer/PriceMonitorManager";
import { UserPriceAlert } from "../patterns/observer/UserPriceAlert";

// We create ONE monitor for the whole application
const priceMonitor = new PriceMonitorManager();

export const registerAlert = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // In a real app, this comes from req.body. Hardcoded for quick testing via GET
  const email = (req.query.email as string) || "student@hcmute.edu.vn";
  const hotelId = (req.query.hotelId as string) || "AG-101";
  const targetPrice = parseInt((req.query.targetPrice as string) || "2000000");

  // Create a new Observer and attach it
  const newAlert = new UserPriceAlert(email, hotelId, targetPrice);
  priceMonitor.attach(newAlert);

  res
    .status(201)
    .json({
      message: `Alert created for ${email}. Target: <= ${targetPrice} VND`,
    });
};

export const triggerPriceDrop = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // Simulate finding a cheap price online
  const hotelId = (req.query.hotelId as string) || "AG-101";
  const newPrice = parseInt((req.query.newPrice as string) || "1500000");

  // Notify all observers!
  priceMonitor.simulatePriceDrop(hotelId, newPrice);

  res
    .status(200)
    .json({
      message: `Simulated price drop for ${hotelId} down to ${newPrice} VND. Check console logs for emails!`,
    });
};

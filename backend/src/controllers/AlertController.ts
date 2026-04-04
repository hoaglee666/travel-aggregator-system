import { Request, Response } from "express";
import { PriceMonitorManager } from "../patterns/observer/PriceMonitorManager";
import { UserPriceAlert } from "../patterns/observer/UserPriceAlert";
import sql from "mssql";

// We create ONE monitor for the whole application
const priceMonitor = new PriceMonitorManager();

export const registerAlert = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const email = (req.query.email as string) || "student@hcmute.edu.vn";
    const hotelId = (req.query.hotelId as string) || "AG-101";
    const targetPrice = parseInt(
      (req.query.targetPrice as string) || "2000000",
    );

    // 1. Add to the Observer Pattern (In-Memory)
    const newAlert = new UserPriceAlert(email, hotelId, targetPrice);
    priceMonitor.attach(newAlert);

    // 2. Save to the SQL Database (So the Dashboard can see it!)
    const request = new sql.Request();
    await request
      .input("email", sql.VarChar, email)
      .input("hotelId", sql.VarChar, hotelId)
      .input("targetPrice", sql.Decimal(18, 2), targetPrice).query(`
          INSERT INTO PRICE_ALERTS (user_email, hotel_id, target_price, is_active)
          VALUES (@email, @hotelId, @targetPrice, 1)
      `);

    res.status(201).json({
      success: true,
      message: `Alert created for ${email}. Target: <= ${targetPrice} VND`,
    });
  } catch (error) {
    console.error("[Alerts] Insert Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Database Error while saving alert." });
  }
};

export const getUserAlerts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userEmail = req.params.email;

    if (!userEmail) {
      res.status(400).json({ success: false, message: "Email is required" });
      return;
    }

    const request = new sql.Request();

    // Fetch all active alerts for this specific user
    const result = await request.input("email", sql.VarChar, userEmail).query(`
              SELECT alert_id, hotel_id, target_price, created_at 
              FROM PRICE_ALERTS 
              WHERE user_email = @email AND is_active = 1
              ORDER BY created_at DESC
          `);

    res.status(200).json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("[Alerts] Fetch Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const triggerPriceDrop = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const hotelId = (req.query.hotelId as string) || "AG-101";
  const newPrice = parseInt((req.query.newPrice as string) || "1500000");

  priceMonitor.simulatePriceDrop(hotelId, newPrice);

  res.status(200).json({
    message: `Simulated price drop for ${hotelId} down to ${newPrice} VND. Check console logs for emails!`,
  });
};

export const deleteAlert = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const alertId = req.params.alertId;
    const request = new sql.Request();

    await request
      .input("alertId", sql.Int, alertId)
      .query("UPDATE PRICE_ALERTS SET is_active = 0 WHERE alert_id = @alertId");

    res
      .status(200)
      .json({ success: true, message: "Alert removed successfully" });
  } catch (error) {
    console.error("[Alerts] Delete Error:", error);
    res.status(500).json({ success: false, message: "Failed to remove alert" });
  }
};

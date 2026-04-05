import { Request, Response } from "express";
import sql from "mssql";
// ✅ Import the pool promise to prevent the ENOCONN crash!
import { poolPromise } from "../config/database";

export const getProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const email = req.params.email;
    const pool = await poolPromise;

    const result = await pool.request().input("email", sql.VarChar, email)
      .query(`
        SELECT full_name, email, phone_number, credit_card, balance 
        FROM USERS 
        WHERE email = @email
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ success: false, message: "Profile not found" });
      return;
    }

    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    console.error("[Profile] Get Error:", error);
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
};

// ✅ NEW: The missing method to handle profile saves!
export const updateProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, fullName, phoneNumber, creditCard } = req.body;

    if (!email) {
      res
        .status(400)
        .json({
          success: false,
          message: "Email is required to update profile",
        });
      return;
    }

    const pool = await poolPromise;
    await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("fullName", sql.VarChar, fullName)
      .input("phoneNumber", sql.VarChar, phoneNumber || "")
      .input("creditCard", sql.VarChar, creditCard || "").query(`
        UPDATE USERS 
        SET full_name = @fullName,
            phone_number = @phoneNumber,
            credit_card = @creditCard
        WHERE email = @email
      `);

    res.json({ success: true, message: "Profile updated successfully!" });
  } catch (error) {
    console.error("[Profile] Update Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
};

export const depositMoney = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, amount } = req.body;
    const pool = await poolPromise;

    await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("amount", sql.Decimal(18, 2), amount)
      .query(
        "UPDATE USERS SET balance = balance + @amount WHERE email = @email",
      );

    res.json({ success: true, message: "Deposit successful!" });
  } catch (error) {
    console.error("[Profile] Deposit Error:", error);
    res.status(500).json({ success: false, message: "Deposit failed" });
  }
};

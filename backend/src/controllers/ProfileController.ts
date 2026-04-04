import { Request, Response } from "express";
import sql from "mssql";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const result =
      await sql.query`SELECT full_name, email, phone_number, credit_card, balance FROM USERS WHERE email = ${email}`;
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
};

export const depositMoney = async (req: Request, res: Response) => {
  try {
    const { email, amount } = req.body;
    await sql.query`UPDATE USERS SET balance = balance + ${amount} WHERE email = ${email}`;
    res.json({ success: true, message: "Deposit successful!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Deposit failed" });
  }
};

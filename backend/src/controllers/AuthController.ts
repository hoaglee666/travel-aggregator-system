import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";

// ✅ Import the Promise
import { poolPromise } from "../config/database";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { fullName, email, password, phone_number, credit_card } = req.body;

    if (!email || !password || !fullName) {
      res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
      return;
    }

    // ✅ Wait for the connection to be fully ready!
    const pool = await poolPromise;
    const request = pool.request();

    const checkUser = await request
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM USERS WHERE email = @email");

    if (checkUser.recordset.length > 0) {
      res.status(400).json({ success: false, message: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await request
      .input("fullName", sql.VarChar, fullName)
      .input("password", sql.VarChar, hashedPassword)
      .input("phone_number", sql.VarChar, phone_number || "")
      .input("credit_card", sql.VarChar, credit_card || "").query(`
        INSERT INTO USERS (full_name, email, password, phone_number, credit_card) 
        VALUES (@fullName, @email, @password, @phone_number, @credit_card)
      `);

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("[Auth] Register Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
      return;
    }

    // ✅ Wait for the connection to be fully ready!
    const pool = await poolPromise;
    const request = pool.request();

    const userResult = await request
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM USERS WHERE email = @email");

    const user = userResult.recordset[0];

    if (!user) {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
      return;
    }

    const userRole = user.email === "admin@gmail.com" ? "Admin" : "Member";

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: userRole },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: userRole,
        phone_number: user.phone_number,
        credit_card: user.credit_card,
      },
    });
  } catch (error) {
    console.error("[Auth] Login Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

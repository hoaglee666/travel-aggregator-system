import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password, fullName, phoneNumber, creditCard } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
      return;
    }

    const request = new sql.Request();

    // Check if email exists
    const checkResult = await request
      .input("email", sql.VarChar, email)
      .query("SELECT id FROM USERS WHERE email = @email");

    if (checkResult.recordset.length > 0) {
      res
        .status(409)
        .json({ success: false, message: "Email is already registered" });
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // INSERT without the 'role' column!
    await request
      .input("newEmail", sql.VarChar, email)
      .input("passwordHash", sql.VarChar, passwordHash)
      .input("fullName", sql.VarChar, fullName || "New User")
      .input("phoneNumber", sql.VarChar, phoneNumber || "")
      .input("creditCard", sql.VarChar, creditCard || "").query(`
                INSERT INTO USERS (email, password, full_name, phone_number, credit_card)
                VALUES (@newEmail, @passwordHash, @fullName, @phoneNumber, @creditCard)
            `);

    res
      .status(201)
      .json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error("[Auth] Registration Error:", error);
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

    const request = new sql.Request();

    // Get user data
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

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
      return;
    }

    // DYNAMIC ROLE ASSIGNMENT (No database column needed!)
    const userRole = user.email === "admin@gmail.com" ? "Admin" : "Member";

    // Generate Token
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
        // ✅ NEW: Send the secure data back to the frontend!
        phone_number: user.phone_number,
        credit_card: user.credit_card,
      },
    });
  } catch (error) {
    console.error("[Auth] Login Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

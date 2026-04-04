import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import sql from "mssql";

export const getSystemLogs = (req: Request, res: Response): void => {
  // Navigate from src/controllers up to the logs directory
  const logPath = path.join(__dirname, "../../logs/system.log");

  try {
    if (fs.existsSync(logPath)) {
      const logs = fs.readFileSync(logPath, "utf8");
      // Split into an array, remove empty lines, and reverse it so newest is at the top
      const logArray = logs
        .split("\n")
        .filter((line) => line.trim() !== "")
        .reverse();
      res.status(200).json({ success: true, data: logArray });
    } else {
      res
        .status(200)
        .json({
          success: true,
          data: ["System log file is currently empty or missing."],
        });
    }
  } catch (error) {
    console.error("[Admin] Log Read Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to read system logs." });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // We do NOT select passwords here for security reasons!
    const result = await sql.query(`
            SELECT id, full_name, email, created_at 
            FROM USERS 
            ORDER BY created_at DESC
        `);

    res.status(200).json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("[Admin] User Fetch Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Database Error while fetching users.",
      });
  }
};

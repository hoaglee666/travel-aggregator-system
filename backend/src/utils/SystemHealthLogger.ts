import fs from "fs";
import path from "path";

export class SystemHealthLogger {
  // 1. The private static instance
  private static instance: SystemHealthLogger;
  private logFile: string;

  // 2. Private constructor prevents direct instantiation with 'new'
  private constructor() {
    const logDir = path.join(__dirname, "../../logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }
    this.logFile = path.join(logDir, "system.log");
    this.logInfo("--- Logger Initialized ---");
  }

  // 3. The global access point
  public static getInstance(): SystemHealthLogger {
    if (!SystemHealthLogger.instance) {
      SystemHealthLogger.instance = new SystemHealthLogger();
    }
    return SystemHealthLogger.instance;
  }

  public logInfo(message: string): void {
    const logMessage = `[INFO] ${new Date().toISOString()} - ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFileSync(this.logFile, logMessage); // Writes to a physical file!
  }

  public logError(message: string, error?: any): void {
    const logMessage = `[ERROR] ${new Date().toISOString()} - ${message} ${error ? JSON.stringify(error) : ""}\n`;
    console.error(logMessage.trim());
    fs.appendFileSync(this.logFile, logMessage);
  }
}

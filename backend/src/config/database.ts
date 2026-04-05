import sql from "mssql";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

const dbName = process.env.DB_NAME as string;
if (!dbName) {
  throw new Error("Missing required environment variable DB_NAME");
}

// Define the connection configuration
const dbConfig: sql.config = {
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: dbName,
  server: process.env.DB_SERVER as string,
  port: parseInt(process.env.DB_PORT || "1433", 10),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const masterConfig: sql.config = {
  ...dbConfig,
  database: "master",
};

export const poolPromise: Promise<sql.ConnectionPool> = (async () => {
  try {
    const masterPool = await sql.connect(masterConfig);

    await masterPool
      .request()
      .input("dbName", sql.NVarChar, dbName)
      .query(
        "IF DB_ID(@dbName) IS NULL EXEC(N'CREATE DATABASE [' + @dbName + ']')",
      );

    await masterPool.close();

    const pool = await sql.connect(dbConfig);
    console.log("✅ Connected to SQL Server successfully!");
    return pool;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
})();

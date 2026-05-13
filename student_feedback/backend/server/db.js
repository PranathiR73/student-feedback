import dotenv from "dotenv";
import mysql from "mysql2";

// ✅ Load .env file from current folder
dotenv.config({ path: "./.env" });

// ✅ Debug: Show if values are loaded
console.log("Loaded env values:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? "" : "EMPTY",
  database: process.env.DB_NAME
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to MySQL:", err);
  } else {
    console.log("✅ Connected to MySQL successfully!");
  }
});

export default db;
import { sql } from "@vercel/postgres";

// Define connection object
const connection = {};

export const connectToDB = async () => {
  try {
    // Check if already connected
    if (connection.isConnected) return;

    // Connect to the PostgreSQL database
    const db = await sql.connect(process.env.POSTGRES_URL);

    // Update connection status
    connection.isConnected = db.connections[0].readyState;

    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error("Failed to connect to the database");
  }
};

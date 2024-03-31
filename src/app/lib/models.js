import { sql } from "@vercel/postgres";

// Define SQL schemas
const userSchema = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    img VARCHAR(255),
    isAdmin BOOLEAN DEFAULT FALSE,
    isActive BOOLEAN DEFAULT TRUE,
    phone VARCHAR(20),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const productSchema = `
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    desc TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    img VARCHAR(255),
    color VARCHAR(50),
    size VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

// Connect to the database
export const connectToDB = async () => {
  try {
    if (connection) return;
    const db = await Promise.resolve(sql.connect(process.env.POSTGRES_URL));
    connection = db;

    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error("Failed to connect to the database");
  }
};

// Call connectToDB to establish the connection
connectToDB();

// Define functions to interact with the database
export const addUser = async (userData) => {
  try {
    const { username, email, password, isAdmin, isActive, phone, address } = userData;

    // Execute SQL query to insert user data into the 'users' table
    await sql.query(
      `
      INSERT INTO users (username, email, password, isAdmin, isActive, phone, address)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [username, email, password, isAdmin, isActive, phone, address]
    );

    console.log("User added successfully");
  } catch (error) {
    console.error("Error adding user:", error);
    throw new Error("Failed to add user");
  }
};

export const addProduct = async (productData) => {
  try {
    const { title, desc, price, stock, img, color, size } = productData;

    // Execute SQL query to insert product data into the 'products' table
    await sql.query(
      `
      INSERT INTO products (title, desc, price, stock, img, color, size)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [title, desc, price, stock, img, color, size]
    );

    console.log("Product added successfully");
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Failed to add product");
  }
};

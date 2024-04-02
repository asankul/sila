import { sql } from "@vercel/postgres";

export const checkAndCreateUsers = async () => {
  try {
    // Check if the table exists
    const result = await sql`SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'users');`;
    const usersExists = result.rows[0].exists;
    
    // If the table doesn't exist, create a new one
    if (!usersExists) {
      await sql`CREATE TABLE IF NOT EXISTS USERS (
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
      )`;
      console.log('Table "Users" created successfully.');
    } else {
      console.log('Table "Users" already exists.');
      const query = await sql`SELECT * FROM USERS;`;
      const users = query.rows
      return  users;
    }
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to check or create the table.');
  }
}


export const checkAndCreateProducts = async () => {
  try {
    // Check if the table exists
    const result = await sql`SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'products');`;
    const productsExists = result.rows[0].exists;
    
    // If the table doesn't exist, create a new one
    if (!productsExists) {
      await sql`CREATE TABLE IF NOT EXISTS PRODUCTS (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
        stock INT NOT NULL CHECK (stock >= 0),
        img VARCHAR(255),
        color VARCHAR(50),
        size VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;
      console.log('Table "Products" created successfully.');
    } else {
      console.log('Table "Products" already exists.');
      const products = (await sql`SELECT * FROM PRODUCTS;`).rows;
      return  products;
    }
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to check or create the table.');
  }
}

export const User = checkAndCreateUsers();
export const Product = checkAndCreateProducts()
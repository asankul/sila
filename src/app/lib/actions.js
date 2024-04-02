"use server";

import { sql } from '@vercel/postgres';
import { revalidatePath } from "next/cache";
import { Product, User } from "./models";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { signIn } from "../auth";
import { fetchUser } from "./data";


export const addUser = async (formData) => {
  const { username, email, password, phone, address, isAdmin, isActive } =
    Object.fromEntries(formData);

  try {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      isAdmin,
      isActive,
    };

    await sql`INSERT INTO users (username, email, password, phone, address, isAdmin, isActive)
    VALUES (${newUser.username}, ${newUser.email}, ${newUser.password}, ${newUser.phone}, ${newUser.address}, ${newUser.isAdmin}, ${newUser.isActive})`;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create user!");
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};

export const updateUser = async (formData) => {
  const { id, username, email, password, phone, address, isAdmin, isActive } =
    Object.fromEntries(formData);

  const user = await fetchUser(id);
  try {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updateFields = {
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      isAdmin,
      isActive,
    };

    Object.keys(updateFields).forEach(
      (key) => {
        if (updateFields[key] === "" || undefined) {
          updateFields[key] = user[key];
        }
      }
    );

    await sql`UPDATE users SET username = ${updateFields.username}, email = ${updateFields.email}, password= ${updateFields.password}, phone= ${updateFields.phone}, address= ${updateFields.address}, isAdmin= ${updateFields.isAdmin}, isActive= ${updateFields.isActive}   WHERE id = ${id}`;

  } catch (err) {
    console.log(err);
    throw new Error("Failed to update user!");
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};

export const addProduct = async (formData) => {
  const { title, desc, price, stock, color, size } =
    Object.fromEntries(formData);

  try {

    const newProduct = new Product({
      title,
      desc,
      price,
      stock,
      color,
      size,
    });

    await newProduct.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create product!");
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
};

export const updateProduct = async (formData) => {
  const { id, title, desc, price, stock, color, size } =
    Object.fromEntries(formData);

  try {

    const updateFields = {
      title,
      desc,
      price,
      stock,
      color,
      size,
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );

    await Product.findByIdAndUpdate(id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update product!");
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
};

export const deleteUser = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {

    await sql`DELETE FROM users WHERE id = ${id}`;

  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete user!");
  }
  
  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};

export const deleteProduct = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {

    await Product.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete product!");
  }

  revalidatePath("/dashboard/products");
};

export const authenticate = async (prevState, formData) => {
  const username = formData.get('username');
  const password = formData.get('password');

  try {
    await signIn("credentials", { username, password });
  } catch (err) {
    if (err.type?.includes("CredentialsSignin")) {
      return "Wrong Credentials";
    }
    throw err;
  }
};

import mysql from "mysql2/promise";
import pool from "../db.js";

class Product {
  static async create(product) {
    const { name, description, price, user_id, image } = product;
    const [result] = await pool.execute(
      "INSERT INTO products (name, description, price, user_id, image) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, user_id, image]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await pool.execute("SELECT * FROM products");
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute("SELECT * FROM products WHERE id = ?", [id]);
    return rows[0];
  }

  static async getByUserId(userId) {
    const [rows] = await pool.execute("SELECT * FROM products WHERE user_id = ?", [userId]);
    return rows;
  }

  static async update(id, product) {
    const { name, description, price, image } = product;
    await pool.execute(
      "UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?",
      [name, description, price, image, id]
    );
  }

  static async delete(id) {
    await pool.execute("DELETE FROM products WHERE id = ?", [id]);
  }
}

export default Product;

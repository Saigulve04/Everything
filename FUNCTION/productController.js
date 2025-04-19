import { sellerPool } from '../DATABASE/db.js';

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.filename : null;
    const user_id = req.user.id;

    const [result] = await sellerPool.query(
      "INSERT INTO products (name, description, price, image, user_id, category) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, price, image, user_id, category]
    );

    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const [products] = await sellerPool.query(
      "SELECT p.*, u.username as seller_name FROM products p JOIN users u ON p.user_id = u.id WHERE p.status = 'active'"
    );

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await sellerPool.query(
      "SELECT p.*, u.username as seller_name FROM products p JOIN users u ON p.user_id = u.id WHERE p.id = ?",
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(products[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
};

export const getUserProducts = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [products] = await sellerPool.query(
      "SELECT * FROM products WHERE user_id = ?",
      [user_id]
    );

    res.json(products);
  } catch (error) {
    console.error("Error fetching user products:", error);
    res.status(500).json({ message: "Error fetching user products" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.filename : undefined;

    // Check if product exists and belongs to user
    const [products] = await sellerPool.query(
      "SELECT * FROM products WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found or unauthorized" });
    }

    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];

    if (name) {
      updates.push("name = ?");
      values.push(name);
    }
    if (description) {
      updates.push("description = ?");
      values.push(description);
    }
    if (price) {
      updates.push("price = ?");
      values.push(price);
    }
    if (category) {
      updates.push("category = ?");
      values.push(category);
    }
    if (image) {
      updates.push("image = ?");
      values.push(image);
    }

    values.push(id);
    values.push(req.user.id);

    await sellerPool.query(
      `UPDATE products SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
      values
    );

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists and belongs to user
    const [products] = await sellerPool.query(
      "SELECT * FROM products WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found or unauthorized" });
    }

    await sellerPool.query(
      "DELETE FROM products WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
}; 
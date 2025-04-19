import Product from "../models/productModel.js";

// Add Product
export const addProduct = (req, res) => {
  const { user_id, name, description, price } = req.body;

  const query = `
    INSERT INTO products (user_id, name, description, price, is_sold)
    VALUES (?, ?, ?, ?, false)
  `;

  db.query(query, [user_id, name, description, price], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Product added successfully", result });
  });
};

// Get Products by User
export const getProductsByUser = (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT * FROM products WHERE user_id = ?
  `;

  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

// Mark Product as Sold
export const markProductSold = (req, res) => {
  const { productId } = req.params;

  const query = `
    UPDATE products SET is_sold = true WHERE id = ?
  `;

  db.query(query, [productId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Product marked as sold", result });
  });
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const image = req.file ? req.file.path : null;
    const user_id = req.user.id;

    const productId = await Product.create({
      name,
      description,
      price,
      user_id,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      productId,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.getById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

export const getUserProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await Product.getByUserId(userId);
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching user products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user products",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const image = req.file ? req.file.path : null;

    const product = await Product.getById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    await Product.update(id, {
      name,
      description,
      price,
      image: image || product.image,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.getById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    await Product.delete(id);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

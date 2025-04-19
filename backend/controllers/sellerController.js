import pool from "../db.js";

// Create seller profile
export const createSellerProfile = async (req, res) => {
  try {
    const { store_name, description, address, phone } = req.body;
    const user_id = req.user.id;

    // Check if user already has a seller profile
    const [existingProfile] = await pool.query(
      "SELECT * FROM seller_profiles WHERE user_id = ?",
      [user_id]
    );

    if (existingProfile.length > 0) {
      return res.status(400).json({ message: "Seller profile already exists" });
    }

    // Update user role to seller
    await pool.query("UPDATE users SET role = 'seller' WHERE id = ?", [user_id]);

    // Create seller profile
    await pool.query(
      "INSERT INTO seller_profiles (user_id, store_name, description, address, phone) VALUES (?, ?, ?, ?, ?)",
      [user_id, store_name, description, address, phone]
    );

    res.status(201).json({ message: "Seller profile created successfully" });
  } catch (error) {
    console.error("Error creating seller profile:", error);
    res.status(500).json({ message: "Error creating seller profile" });
  }
};

// Get seller profile
export const getSellerProfile = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [profile] = await pool.query(
      "SELECT * FROM seller_profiles WHERE user_id = ?",
      [user_id]
    );

    if (profile.length === 0) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    res.json(profile[0]);
  } catch (error) {
    console.error("Error fetching seller profile:", error);
    res.status(500).json({ message: "Error fetching seller profile" });
  }
};

// Update seller profile
export const updateSellerProfile = async (req, res) => {
  try {
    const { store_name, description, address, phone } = req.body;
    const user_id = req.user.id;

    await pool.query(
      "UPDATE seller_profiles SET store_name = ?, description = ?, address = ?, phone = ? WHERE user_id = ?",
      [store_name, description, address, phone, user_id]
    );

    res.json({ message: "Seller profile updated successfully" });
  } catch (error) {
    console.error("Error updating seller profile:", error);
    res.status(500).json({ message: "Error updating seller profile" });
  }
};

// Get seller's products
export const getSellerProducts = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [products] = await pool.query(
      "SELECT * FROM products WHERE user_id = ?",
      [user_id]
    );

    res.json(products);
  } catch (error) {
    console.error("Error fetching seller products:", error);
    res.status(500).json({ message: "Error fetching seller products" });
  }
};

// Get seller statistics
export const getSellerStats = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Get total products
    const [products] = await pool.query(
      "SELECT COUNT(*) as total_products FROM products WHERE user_id = ?",
      [user_id]
    );

    // Get total sales
    const [sales] = await pool.query(
      "SELECT COUNT(*) as total_sales FROM products WHERE user_id = ? AND status = 'sold'",
      [user_id]
    );

    // Get average rating
    const [rating] = await pool.query(
      "SELECT rating FROM seller_profiles WHERE user_id = ?",
      [user_id]
    );

    res.json({
      total_products: products[0].total_products,
      total_sales: sales[0].total_sales,
      rating: rating[0].rating,
    });
  } catch (error) {
    console.error("Error fetching seller stats:", error);
    res.status(500).json({ message: "Error fetching seller statistics" });
  }
}; 
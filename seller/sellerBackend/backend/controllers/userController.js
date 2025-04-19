import db from "../db.js";

export const getUser = (req, res) => {
  const userId = req.params.id;
  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]);
  });
};

export const updateBankDetails = async (req, res) => {
  const { bankName, accountNumber, ifscCode, branchLocation } = req.body;
  const userId = req.user.id; // Get user ID from auth middleware

  try {
    // Validate required fields
    if (!bankName || !accountNumber || !ifscCode || !branchLocation) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["bankName", "accountNumber", "ifscCode", "branchLocation"]
      });
    }

    // Check if bank details already exist for this user
    const query = `
      INSERT INTO bank_details (user_id, bank_name, account_number, ifsc_code, branch_location)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        bank_name = VALUES(bank_name),
        account_number = VALUES(account_number),
        ifsc_code = VALUES(ifsc_code),
        branch_location = VALUES(branch_location)
    `;

    db.query(
      query,
      [userId, bankName, accountNumber, ifscCode, branchLocation],
      (err, result) => {
        if (err) {
          console.error("Error updating bank details:", err);
          return res.status(500).json({ error: "Failed to update bank details" });
        }
        res.json({
          message: "Bank details updated successfully",
          bankDetails: {
            bankName,
            accountNumber,
            ifscCode,
            branchLocation
          }
        });
      }
    );
  } catch (error) {
    console.error("Error in updateBankDetails:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBankDetails = (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT bank_name, account_number, ifsc_code, branch_location FROM bank_details WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) {
        console.error("Error fetching bank details:", err);
        return res.status(500).json({ error: "Failed to fetch bank details" });
      }
      
      if (result.length === 0) {
        return res.json({ message: "No bank details found" });
      }

      res.json(result[0]);
    }
  );
};

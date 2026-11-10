const express = require("express");
const pool = require("../src/db");
const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

const router = express.Router();

// Return registered customer accounts for administrators.
router.get("/customers", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, created_at
       FROM users
       WHERE role = 'user'
       ORDER BY created_at DESC`
    );

    res.json({ customers: result.rows });
  } catch (error) {
    console.error("Get customers error:", error.message);
    res.status(500).json({ message: "Could not load customers." });
  }
});

// Delete a customer and their associated appointments.
router.delete("/customers/:id", authenticateToken, requireAdmin, async (req, res) => {
  const customerId = req.params.id;

  if (!/^\d+$/.test(customerId)) {
    return res.status(400).json({ message: "Invalid customer ID." });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const customerResult = await client.query(
      "SELECT id, name, email, role FROM users WHERE id = $1 FOR UPDATE",
      [customerId]
    );

    if (customerResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Customer not found." });
    }

    const customer = customerResult.rows[0];

    if (customer.role !== "user") {
      await client.query("ROLLBACK");
      return res.status(403).json({ message: "Only customer accounts can be deleted." });
    }

    await client.query(
      "DELETE FROM appointments WHERE user_id = $1",
      [customerId]
    );

    await client.query(
      "DELETE FROM users WHERE id = $1 AND role = 'user'",
      [customerId]
    );

    await client.query("COMMIT");

    res.json({
      message: "Customer and associated appointments deleted successfully.",
      customerId: customer.id,
      email: customer.email
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Delete customer error:", error.message);
    res.status(500).json({ message: "Could not delete customer." });
  } finally {
    client.release();
  }
});

module.exports = router;

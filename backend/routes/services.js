const express = require("express");
const pool = require("../src/db");
const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, description, duration_minutes, price, is_active FROM services WHERE is_active = TRUE ORDER BY id"
    );

    res.json({ services: result.rows });
  } catch (error) {
    console.error("Get services error:", error.message);
    res.status(500).json({ message: "Could not load services." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, description, duration_minutes, price, is_active FROM services WHERE id = $1 AND is_active = TRUE",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.json({ service: result.rows[0] });
  } catch (error) {
    console.error("Get service error:", error.message);
    res.status(500).json({ message: "Could not load the service." });
  }
});

router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim();
    const duration = Number(req.body.duration_minutes);
    const price = Number(req.body.price);

    if (!name || name.length < 2) {
      return res.status(400).json({ message: "Service name must be at least 2 characters long." });
    }

    if (!Number.isInteger(duration) || duration <= 0) {
      return res.status(400).json({ message: "Duration must be a positive number." });
    }

    if (Number.isNaN(price) || price < 0) {
      return res.status(400).json({ message: "Price must be zero or greater." });
    }

    const result = await pool.query(
      "INSERT INTO services (name, description, duration_minutes, price) VALUES ($1, $2, $3, $4) RETURNING id, name, description, duration_minutes, price, is_active, created_at",
      [name, description || null, duration, price]
    );

    res.status(201).json({ service: result.rows[0] });
  } catch (error) {
    console.error("Create service error:", error.message);
    res.status(500).json({ message: "Could not create the service." });
  }
});

router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim();
    const duration = Number(req.body.duration_minutes);
    const price = Number(req.body.price);
    const isActive = req.body.is_active !== false;

    if (!name || name.length < 2) {
      return res.status(400).json({ message: "Service name must be at least 2 characters long." });
    }

    if (!Number.isInteger(duration) || duration <= 0) {
      return res.status(400).json({ message: "Duration must be a positive number." });
    }

    if (Number.isNaN(price) || price < 0) {
      return res.status(400).json({ message: "Price must be zero or greater." });
    }

    const result = await pool.query(
      "UPDATE services SET name = $1, description = $2, duration_minutes = $3, price = $4, is_active = $5 WHERE id = $6 RETURNING id, name, description, duration_minutes, price, is_active, created_at",
      [name, description || null, duration, price, isActive, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.json({ service: result.rows[0] });
  } catch (error) {
    console.error("Update service error:", error.message);
    res.status(500).json({ message: "Could not update the service." });
  }
});

router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE services SET is_active = FALSE WHERE id = $1 RETURNING id, name, is_active",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.json({
      message: "Service deactivated successfully.",
      service: result.rows[0]
    });
  } catch (error) {
    console.error("Delete service error:", error.message);
    res.status(500).json({ message: "Could not deactivate the service." });
  }
});

module.exports = router;

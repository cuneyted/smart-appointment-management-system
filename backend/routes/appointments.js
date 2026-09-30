const express = require("express");
const pool = require("../src/db");
const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  const { serviceId, date, time, notes } = req.body;

  if (!serviceId || !date || !time) {
    return res.status(400).json({ message: "Service, date and time are required." });
  }

  try {
    const service = await pool.query(
      "SELECT id FROM services WHERE id = $1 AND is_active = TRUE",
      [serviceId]
    );

    if (service.rows.length === 0) {
      return res.status(404).json({ message: "Service not found." });
    }

    const existing = await pool.query(
      "SELECT id FROM appointments WHERE date = $1 AND time = $2 AND status <> 'cancelled'",
      [date, time]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "This time is already booked." });
    }

    const result = await pool.query(
      "INSERT INTO appointments (user_id, service_id, date, time, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.user.id, serviceId, date, time, notes || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create appointment error:", error.message);
    res.status(500).json({ message: "Could not create appointment." });
  }
});

router.get("/my", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.date, a.time, a.status, a.notes,
              s.name AS service_name, s.duration_minutes, s.price
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       WHERE a.user_id = $1
       ORDER BY a.date ASC, a.time ASC`, 
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get appointments error:", error.message);
    res.status(500).json({ message: "Could not get appointments." });
  }
});

router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.date, a.time, a.status, a.notes,
              u.name AS customer_name, u.email AS customer_email,
              s.name AS service_name, s.duration_minutes, s.price
       FROM appointments a
       JOIN users u ON a.user_id = u.id
       JOIN services s ON a.service_id = s.id
       ORDER BY a.date ASC, a.time ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Admin appointments error:", error.message);
    res.status(500).json({ message: "Could not get appointments." });
  }
});

router.put("/:id/status", authenticateToken, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ["pending", "confirmed", "cancelled", "completed"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid appointment status." });
  }

  try {
    const result = await pool.query(
      "UPDATE appointments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update appointment error:", error.message);
    res.status(500).json({ message: "Could not update appointment." });
  }
});

module.exports = router;

import express from "express";
import db from "../config/database.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateToken, isAdmin);



// Get all admin users
router.get("/admins/all", async (req, res) => {
  try {
    const [admins] = await db.query("SELECT * FROM admin");
    res.json({ status: "success", data: admins });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});


// Update admin
router.put("/admins/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    const adminId = req.params.id;
    
    // Build dynamic query
    const updates = [];
    const values = [];
    
    if (name) {
      updates.push("name = ?");
      values.push(name);
    }
    
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No fields to update"
      });
    }
    
    values.push(adminId);
    
    await db.query(
      `UPDATE admin SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    
    res.json({ 
      status: "success", 
      message: "Admin updated successfully" 
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Delete admin
router.delete("/admins/:id", async (req, res) => {
  try {
    const adminId = req.params.id;
    
    await db.query("DELETE FROM admin WHERE id = ?", [adminId]);
    
    res.json({ 
      status: "success", 
      message: "Admin deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;
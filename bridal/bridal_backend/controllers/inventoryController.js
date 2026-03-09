import {
  getAllInventory,
  addInventory,
  updateInventory,
  deleteInventory
} from "../models/inventoryModel.js";

// ✅ Get all inventory items
export const fetchInventory = (req, res) => {
  getAllInventory((err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// ✅ Add new inventory item
export const createInventory = (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  addInventory({ name, category, quantity, price, description }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Inventory added successfully", id: result.insertId });
  });
};

// ✅ Update inventory item
export const editInventory = (req, res) => {
  const id = req.params.id;
  const { name, category, quantity, price, description } = req.body;
  updateInventory(id, { name, category, quantity, price, description }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Inventory updated successfully" });
  });
};

// ✅ Delete inventory item
export const removeInventory = (req, res) => {
  const id = req.params.id;
  deleteInventory(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Inventory deleted successfully" });
  });
};

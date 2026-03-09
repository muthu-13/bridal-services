import db from "../config/db.js";

// Get all inventory items
export const getAllInventory = (callback) => {
  db.query("SELECT * FROM inventory ORDER BY created_at DESC", callback);
};

// Add new inventory item
export const addInventory = (data, callback) => {
  const { name, category, quantity, price, description } = data;
  db.query(
    "INSERT INTO inventory (name, category, quantity, price, description) VALUES (?, ?, ?, ?, ?)",
    [name, category, quantity, price, description],
    callback
  );
};

// Update inventory item
export const updateInventory = (id, data, callback) => {
  const { name, category, quantity, price, description } = data;
  db.query(
    "UPDATE inventory SET name=?, category=?, quantity=?, price=?, description=? WHERE id=?",
    [name, category, quantity, price, description, id],
    callback
  );
};

// Delete inventory item
export const deleteInventory = (id, callback) => {
  db.query("DELETE FROM inventory WHERE id=?", [id], callback);
};

import db from "../config/db.js";

export const getServicesByCategory = (category, callback) => {
  db.query("SELECT * FROM services WHERE category = ?", [category], callback);
};

export const getAllServices = (callback) => {
  db.query("SELECT * FROM services", callback);
};

export const addService = (service, callback) => {
  const { category, image_url, description, rating } = service;
  db.query(
    "INSERT INTO services (category, image_url, description, rating) VALUES (?, ?, ?, ?)",
    [category, image_url, description, rating],
    callback
  );
};

export const updateService = (id, service, callback) => {
  const { category, image_url, description, rating } = service;
  db.query(
    "UPDATE services SET category=?, image_url=?, description=?, rating=? WHERE id=?",
    [category, image_url, description, rating, id],
    callback
  );
};

export const deleteService = (id, callback) => {
  db.query("DELETE FROM services WHERE id = ?", [id], callback);
};

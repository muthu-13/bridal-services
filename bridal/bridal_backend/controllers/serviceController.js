import {
  getServicesByCategory,
  getAllServices,
  addService,
  updateService,
  deleteService,
} from "../models/serviceModel.js";

export const fetchServices = (req, res) => {
  getAllServices((err, results) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    res.json(results);
  });
};

export const fetchServicesByCategory = (req, res) => {
  const { category } = req.params;
  getServicesByCategory(category, (err, results) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    res.json(results);
  });
};

export const createService = (req, res) => {
  addService(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    res.json({ message: "Service added", id: result.insertId });
  });
};

export const editService = (req, res) => {
  updateService(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    res.json({ message: "Service updated" });
  });
};

export const removeService = (req, res) => {
  deleteService(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    res.json({ message: "Service deleted" });
  });
};

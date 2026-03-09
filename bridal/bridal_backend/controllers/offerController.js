import {
  addOffer,
  getAllOffers,
  getActiveOffers,
  deleteOffer,
  updateOffer,
} from "../models/offerModel.js";

// ✅ Add new offer
export const createOffer = async (req, res) => {
  try {
    const result = await addOffer(req.body);
    res.status(201).json({ message: "Offer created successfully", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all offers
export const fetchAllOffers = async (req, res) => {
  try {
    const offers = await getAllOffers();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get only active offers
export const fetchActiveOffers = async (req, res) => {
  try {
    const offers = await getActiveOffers();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete an offer by ID
export const removeOffer = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteOffer(id);
    res.json({ message: "Offer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update an offer by ID
export const editOffer = async (req, res) => {
  try {
    const { id } = req.params;
    await updateOffer(id, req.body);
    res.json({ message: "Offer updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

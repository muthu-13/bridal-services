import {
  getBookingsByUser,
  getPaymentsByUser,
  getWishlistByUser,

} from "../models/userDashboardModel.js";

export const getBookings = (req, res) => {
  getBookingsByUser(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

export const getPayments = (req, res) => {
  getPaymentsByUser(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

export const getWishlist = (req, res) => {
  getWishlistByUser(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};


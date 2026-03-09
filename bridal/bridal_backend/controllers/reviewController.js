import * as Review from "../models/reviewModel.js";

export const submitReview = (req, res) => {
  const review = req.body;
  Review.addReview(review, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ message: "Review submitted!" });
  });
};

export const fetchApprovedReviews = (req, res) => {
  Review.getApprovedReviews((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const fetchAllReviews = (req, res) => {
  Review.getAllReviews((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const approveReviewById = (req, res) => {
  const { id } = req.params;
  Review.approveReview(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Review approved!" });
  });
};

export const deleteReviewById = (req, res) => {
  const { id } = req.params;
  Review.deleteReview(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Review deleted!" });
  });
};

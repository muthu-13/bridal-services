import express from "express";
import {
  createOffer,
  fetchAllOffers,
  fetchActiveOffers,
  removeOffer,
  editOffer,
} from "../controllers/offerController.js";

const router = express.Router();


router.post("/", createOffer);


router.get("/", fetchAllOffers);

router.get("/active", fetchActiveOffers);

// ✅ Update an offer by ID
router.put("/:id", editOffer);

// ✅ Delete an offer by ID
router.delete("/:id", removeOffer);

export default router;

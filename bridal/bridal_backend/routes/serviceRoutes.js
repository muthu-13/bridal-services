import express from "express";
import { 
  fetchServices, 
  fetchServicesByCategory,   // ✅ corrected name
  createService, 
  editService, 
  removeService 
} from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", fetchServices);
router.get("/:category", fetchServicesByCategory); // ✅ match name
router.post("/", createService);
router.put("/:id", editService);
router.delete("/:id", removeService);

export default router;

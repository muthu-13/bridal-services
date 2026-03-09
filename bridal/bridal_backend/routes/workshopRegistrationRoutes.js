import express from "express";
import {
  registerForWorkshop,
  getAllWorkshopsRegistrationsHandler,
  

} from "../controllers/workshopRegistrationController.js";

const router = express.Router();

// Register user for a workshop
router.post("/workshops/:id/register", registerForWorkshop);

// Get all workshop registrations (for admin)
router.get("/workshops/registrations/all", getAllWorkshopsRegistrationsHandler);


export default router;

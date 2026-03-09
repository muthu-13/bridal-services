import express from 'express';
import {
  createWorkshop,
  getAllWorkshops,
  getWorkshopById,
  updateWorkshop,
  deleteWorkshop
} from '../controllers/workshopController.js';

const router = express.Router();

router.post('/workshops', createWorkshop);
router.get('/workshops', getAllWorkshops);
router.get('/workshops/:id', getWorkshopById);
router.put('/workshops/:id', updateWorkshop);
router.delete('/workshops/:id', deleteWorkshop);

export default router;

import express from 'express';
import { submitContact, getContacts } from '../controllers/contactController.js';

const router = express.Router();

router.post('/submit', submitContact);
router.get('/all', getContacts);

export default router;

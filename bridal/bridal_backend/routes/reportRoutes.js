import express from 'express';
import reportController from '../controllers/reportController.js';
import db from '../config/db.js';

const router = express.Router();

// Test database connection
router.get('/test-db', async (req, res) => {
  try {
    const [result] = await db.execute('SELECT 1 as test');
    res.json({ 
      success: true, 
      message: 'Database connected successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Report routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Report routes
router.get('/financial-summary', reportController.getFinancialSummary);
router.get('/payment-stats', reportController.getPaymentStats);
router.get('/top-services', reportController.getTopServices);
router.get('/comprehensive', reportController.getComprehensiveReport);

export default router;
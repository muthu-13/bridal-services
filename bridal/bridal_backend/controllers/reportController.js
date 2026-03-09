import ReportModel from '../models/reportModel.js';

const reportController = {
  // Get financial summary
  getFinancialSummary: async (req, res) => {
    try {
      const financialSummary = await ReportModel.getFinancialSummary();
      res.status(200).json({ 
        success: true, 
        data: financialSummary
      });
    } catch (error) {
      console.error('Error in financial summary:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching financial summary', 
        error: error.message 
      });
    }
  },

  // Get payment statistics
  getPaymentStats: async (req, res) => {
    try {
      const paymentStats = await ReportModel.getPaymentStats();
      res.status(200).json({ 
        success: true, 
        data: paymentStats
      });
    } catch (error) {
      console.error('Error in payment stats:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching payment statistics', 
        error: error.message 
      });
    }
  },

  // Get top services
  getTopServices: async (req, res) => {
    try {
      const topServices = await ReportModel.getTopServices();
      res.status(200).json({ 
        success: true, 
        data: topServices
      });
    } catch (error) {
      console.error('Error in top services:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching top services', 
        error: error.message 
      });
    }
  },

  // Get comprehensive report
  getComprehensiveReport: async (req, res) => {
    try {
      // Get all data for comprehensive report
      const [financialSummary, paymentStats, topServices, refundDetails, recentBookings] = await Promise.all([
        ReportModel.getFinancialSummary(),
        ReportModel.getPaymentStats(),
        ReportModel.getTopServices(),
        ReportModel.getRefundDetails(),
        ReportModel.getRecentBookings(10)
      ]);

      res.status(200).json({ 
        success: true, 
        data: {
          financialSummary,
          paymentStats,
          topServices,
          refundDetails,
          recentBookings
        }
      });
    } catch (error) {
      console.error('Error in comprehensive report:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching comprehensive report', 
        error: error.message 
      });
    }
  },

  // Get refund details
  getRefundDetails: async (req, res) => {
    try {
      const refundDetails = await ReportModel.getRefundDetails();
      res.status(200).json({ 
        success: true, 
        data: refundDetails
      });
    } catch (error) {
      console.error('Error in refund details:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching refund details', 
        error: error.message 
      });
    }
  },

  // Get recent bookings
  getRecentBookings: async (req, res) => {
    try {
      const limit = req.query.limit || 5;
      const recentBookings = await ReportModel.getRecentBookings(limit);
      res.status(200).json({ 
        success: true, 
        data: recentBookings
      });
    } catch (error) {
      console.error('Error in recent bookings:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching recent bookings', 
        error: error.message 
      });
    }
  }
};

export default reportController;
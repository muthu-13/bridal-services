import db from '../config/db.js';

const ReportModel = {
  // Get financial summary
  getFinancialSummary: () => {
    return new Promise((resolve, reject) => {
      console.log('Fetching financial summary...');
      
      // Booking revenue
      const bookingRevenueQuery = `
        SELECT 
          COALESCE(SUM(amount), 0) as total_booking_revenue,
          COUNT(*) as total_bookings,
          COALESCE(SUM(CASE WHEN payment_status = 'success' THEN amount ELSE 0 END), 0) as successful_booking_revenue,
          COALESCE(SUM(CASE WHEN payment_status = 'failed' THEN amount ELSE 0 END), 0) as failed_booking_revenue,
          COALESCE(SUM(refund_amount), 0) as total_refunds
        FROM payments
      `;
      
      db.query(bookingRevenueQuery, (err, bookingRevenue) => {
        if (err) {
          console.error('Error in booking revenue query:', err);
          return reject(err);
        }

        // Workshop revenue
        const workshopRevenueQuery = `
          SELECT 
            COALESCE(SUM(amount), 0) as total_workshop_revenue,
            COUNT(*) as total_workshop_payments,
            COALESCE(SUM(CASE WHEN payment_status = 'success' THEN amount ELSE 0 END), 0) as successful_workshop_revenue,
            COALESCE(SUM(CASE WHEN payment_status = 'failed' THEN amount ELSE 0 END), 0) as failed_workshop_revenue,
            COALESCE(SUM(refund_amount), 0) as total_refunds
          FROM workshop_payments
        `;
        
        db.query(workshopRevenueQuery, (err, workshopRevenue) => {
          if (err) {
            console.error('Error in workshop revenue query:', err);
            return reject(err);
          }

          // Staff costs
          const staffCostQuery = `SELECT COALESCE(SUM(salary), 0) as total_staff_cost FROM staff`;
          db.query(staffCostQuery, (err, staffCost) => {
            if (err) {
              console.error('Error in staff cost query:', err);
              return reject(err);
            }

            // Inventory value
            const inventoryValueQuery = `SELECT COALESCE(SUM(quantity * price), 0) as total_inventory_value FROM inventory`;
            db.query(inventoryValueQuery, (err, inventoryValue) => {
              if (err) {
                console.error('Error in inventory value query:', err);
                return reject(err);
              }

              // Total users
              const totalUsersQuery = `SELECT COUNT(*) as total_users FROM users`;
              db.query(totalUsersQuery, (err, totalUsers) => {
                if (err) {
                  console.error('Error in total users query:', err);
                  return reject(err);
                }

                resolve({
                  bookingRevenue: bookingRevenue[0],
                  workshopRevenue: workshopRevenue[0],
                  staffCost: staffCost[0],
                  inventoryValue: inventoryValue[0],
                  totalUsers: totalUsers[0]
                });
              });
            });
          });
        });
      });
    });
  },

  // Get payment statistics
  getPaymentStats: () => {
    return new Promise((resolve, reject) => {
      const bookingStatsQuery = `
        SELECT 
          payment_status,
          COUNT(*) as count,
          COALESCE(SUM(amount), 0) as total_amount
        FROM payments 
        GROUP BY payment_status
      `;
      
      db.query(bookingStatsQuery, (err, bookingStats) => {
        if (err) {
          console.error('Error in booking stats query:', err);
          return reject(err);
        }

        const workshopStatsQuery = `
          SELECT 
            payment_status,
            COUNT(*) as count,
            COALESCE(SUM(amount), 0) as total_amount
          FROM workshop_payments 
          GROUP BY payment_status
        `;
        
        db.query(workshopStatsQuery, (err, workshopStats) => {
          if (err) {
            console.error('Error in workshop stats query:', err);
            return reject(err);
          }

          resolve({
            bookingStats,
            workshopStats
          });
        });
      });
    });
  },

  // Get top services
  getTopServices: () => {
    return new Promise((resolve, reject) => {
      const topServicesQuery = `
        SELECT 
          s.category,
          COUNT(b.id) as booking_count,
          COALESCE(SUM(p.amount), 0) as total_revenue
        FROM services s
        LEFT JOIN bookings b ON FIND_IN_SET(s.category, b.services) > 0
        LEFT JOIN payments p ON b.id = p.booking_id AND p.payment_status = 'success'
        GROUP BY s.category
        ORDER BY total_revenue DESC
        LIMIT 10
      `;
      
      db.query(topServicesQuery, (err, topServices) => {
        if (err) {
          console.error('Error in top services query:', err);
          return reject(err);
        }
        resolve(topServices);
      });
    });
  },

  // Get refund details
  getRefundDetails: () => {
    return new Promise((resolve, reject) => {
      const bookingRefundsQuery = `
        SELECT 
          COUNT(*) as refund_count,
          COALESCE(SUM(refund_amount), 0) as total_refund_amount
        FROM payments 
        WHERE refund_amount > 0
      `;
      
      db.query(bookingRefundsQuery, (err, bookingRefunds) => {
        if (err) {
          console.error('Error in booking refunds query:', err);
          return reject(err);
        }

        const workshopRefundsQuery = `
          SELECT 
            COUNT(*) as refund_count,
            COALESCE(SUM(refund_amount), 0) as total_refund_amount
          FROM workshop_payments 
          WHERE refund_amount > 0
        `;
        
        db.query(workshopRefundsQuery, (err, workshopRefunds) => {
          if (err) {
            console.error('Error in workshop refunds query:', err);
            return reject(err);
          }

          resolve({
            bookingRefunds: bookingRefunds[0],
            workshopRefunds: workshopRefunds[0]
          });
        });
      });
    });
  },

  // Get recent bookings
  getRecentBookings: (limit = 5) => {
    return new Promise((resolve, reject) => {
      const recentBookingsQuery = `
        SELECT 
          b.id,
          b.brideName,
          b.eventTypes,
          b.venue,
          b.date,
          b.services,
          b.package,
          p.amount,
          p.payment_status,
          b.created_at
        FROM bookings b
        LEFT JOIN payments p ON b.id = p.booking_id
        ORDER BY b.created_at DESC
        LIMIT ${parseInt(limit)}
      `;
      
      db.query(recentBookingsQuery, (err, recentBookings) => {
        if (err) {
          console.error('Error in recent bookings query:', err);
          return reject(err);
        }
        resolve(recentBookings);
      });
    });
  }
};

export default ReportModel;
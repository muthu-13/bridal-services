import db from "../config/db.js";

// Total bookings
export const getTotalBookings = async () => {
  const [[result]] = await db.promise().query("SELECT COUNT(*) AS totalBookings FROM bookings");
  return result.totalBookings || 0;
};

// Total services
export const getTotalServices = async () => {
  const [[result]] = await db.promise().query("SELECT COUNT(*) AS totalServices FROM services");
  return result.totalServices || 0;
};

export const getTotalWorkshops = async () => {
  const [[result]] = await db.promise().query(
    "SELECT COUNT(*) AS totalWorkshops FROM workshop_registrations"
  );
  return result.totalWorkshops || 0;
};


// Total revenue
export const getTotalRevenue = async () => {
  const [[bookingRevenue]] = await db.promise().query(
    "SELECT SUM(amount) AS total FROM payments WHERE payment_status='success'"
  );
  const [[workshopRevenue]] = await db.promise().query(
    "SELECT SUM(amount) AS total FROM workshop_payments WHERE payment_status='success'"
  );
  return (bookingRevenue.total || 0) + (workshopRevenue.total || 0);
};

// Monthly revenue (last 6 months)
// Monthly revenue (last 6 months)
export const getMonthlyRevenue = async () => {
  const [monthlyRevenue] = await db.promise().query(`
   SELECT 
  DATE_FORMAT(MIN(created_at), '%b') AS month,
  SUM(amount) AS total
FROM (
  SELECT timestamp AS created_at, amount 
  FROM payments 
  WHERE payment_status='success'

  UNION ALL

  SELECT created_at, amount 
  FROM workshop_payments 
  WHERE payment_status='success'
) AS all_payments
GROUP BY YEAR(created_at), MONTH(created_at)
ORDER BY MIN(created_at) DESC
LIMIT 6;

  `);
  return monthlyRevenue.reverse(); // earliest month first
};

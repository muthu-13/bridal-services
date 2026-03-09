import {
  getTotalBookings,
  getTotalServices,
  getTotalWorkshops,
  getTotalRevenue,
  getMonthlyRevenue,
} from "../models/DashboardModel.js";

export const fetchDashboardStats = async (req, res) => {
  try {
    const [totalBookings, totalServices, totalWorkshops, totalRevenue, monthlyRevenue] =
      await Promise.all([
        getTotalBookings(),
        getTotalServices(),
        getTotalWorkshops(),
        getTotalRevenue(),
        getMonthlyRevenue(),
      ]);

    res.json({
      totalBookings,
      totalServices,
      totalWorkshops,
      totalRevenue,
      monthlyRevenue,
    });
  } catch (err) {
    console.error("❌ DashboardController Error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

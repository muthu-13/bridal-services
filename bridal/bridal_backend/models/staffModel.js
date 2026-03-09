import db from "../config/db.js";

// Fetch all staff
export const getAllStaff = (callback) => {
  db.query("SELECT * FROM staff", callback);
};

// Add new staff
export const addStaff = (staffData, callback) => {
  const { name, role, phone, email, salary } = staffData;
  db.query(
    "INSERT INTO staff (name, role, phone, email, salary) VALUES (?, ?, ?, ?, ?)",
    [name, role, phone, email, salary],
    callback
  );
};

// Update salary
export const updateStaffSalary = (staff_id, salary, callback) => {
  db.query(
    "UPDATE staff SET salary = ? WHERE id = ?",
    [salary, staff_id],
    callback
  );
};

// Assign staff to a booking
export const assignStaffToBooking = (booking_id, staff_id, callback) => {
  db.query(
    "INSERT INTO booking_staff (booking_id, staff_id) VALUES (?, ?)",
    [booking_id, staff_id],
    callback
  );
};

// Get staff assigned for a booking
export const getBookingStaff = (booking_id, callback) => {
  db.query(
    `SELECT s.id, s.name, s.role, s.phone, s.email 
     FROM booking_staff bs 
     JOIN staff s ON bs.staff_id = s.id 
     WHERE bs.booking_id = ?`,
    [booking_id],
    callback
  );
};

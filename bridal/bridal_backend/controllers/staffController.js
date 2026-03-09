import {
  getAllStaff,
  addStaff,
  assignStaffToBooking,
  getBookingStaff,
  updateStaffSalary,
} from "../models/staffModel.js";
import db from "../config/db.js";
import nodemailer from "nodemailer";

// ✅ Mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// GET all staff
export const fetchStaff = (req, res) => {
  getAllStaff((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// POST add staff
export const createStaff = (req, res) => {
  addStaff(req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Staff added successfully", id: results.insertId });
  });
};

// PUT update staff salary
export const setSalary = (req, res) => {
  const { staff_id, salary } = req.body;
  updateStaffSalary(staff_id, salary, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Salary updated successfully ✅" });
  });
};

// POST assign staff to a booking + email
export const assignStaff = (req, res) => {
  const { booking_id, staff_id } = req.body;

  assignStaffToBooking(booking_id, staff_id, async (err) => {
    if (err) return res.status(500).json({ error: err });

    try {
      const [staffRows] = await db
        .promise()
        .query("SELECT * FROM staff WHERE id = ?", [staff_id]);

      const [bookingRows] = await db
        .promise()
        .query("SELECT * FROM bookings WHERE id = ?", [booking_id]);

      const staff = staffRows[0];
      const booking = bookingRows[0];

      if (staff && booking) {
        const mailOptions = {
          from: process.env.MAIL_USER,
          to: staff.email,
          subject: `📢 New Booking Assigned (Booking ID: ${booking.id})`,
          text: `
Hi ${staff.name},

You have been assigned to a new booking.

📋 Booking Details:
- Bride: ${booking.brideName}
- Venue: ${booking.venue}
- Date: ${booking.date}
- Services: ${booking.services}
- Package: ${booking.package}
- Phone: ${booking.phone}

Thanks,  
Admin Team
          `,
        };

        await transporter.sendMail(mailOptions);
      }

      res.json({ message: "Staff assigned and email sent successfully ✅" });
    } catch (e) {
      console.error("Mail error:", e);
      res.json({ message: "Staff assigned but email failed ❌" });
    }
  });
};

// GET staff for a booking
export const fetchBookingStaff = (req, res) => {
  const { booking_id } = req.params;
  getBookingStaff(booking_id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

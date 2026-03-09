import { 
  createBooking, 
  getAllBookings, 
  cancelBooking, 
  cancelPayment 
} from "../models/bookingModel.js";
import { createNotification } from "../models/notificationModel.js";
export const addBooking = (req, res) => {
  const booking = req.body;

  createBooking(booking, async (err, result) => {
    if (err) {
      console.error("DB Insert Error:", err);
      return res.status(500).json({ success: false, error: err });
    }

    // Create notification for user
    try {
      await createNotification(
        booking.user_id,
        `Your booking for ${booking.services} on ${booking.date} has been saved successfully.`,
        "booking"
      );
    } catch (notifErr) {
      console.error("Notification creation error:", notifErr);
    }

    res.status(201).json({
      success: true,
      message: "Booking saved!",
      id: result.insertId,
    });
  });
};


export const fetchBookings = (req, res) => {
  getAllBookings((err, results) => {
    if (err) {
      console.error("DB Fetch Error:", err);
      return res.status(500).json({ success: false, error: err });
    }
    res.json({ success: true, data: results });
  });
};

export const cancelUserBooking = (req, res) => {
  const { id } = req.params;

  cancelBooking(id, async (err) => {
    if (err) {
      console.error("Cancel Booking Error:", err);
      return res.status(500).json({ success: false, error: err });
    }

    cancelPayment(id, async (payErr, msg) => {
      if (payErr) {
        console.error("Cancel Payment Error:", payErr);
        return res.status(500).json({ success: false, error: payErr });
      }

      // Notify user about cancellation
      try {
        // You may need to get user_id associated with booking id
        const userId = await getUserIdByBookingId(id); // Implement this helper to query DB
        await createNotification(
          userId,
          `Your booking (ID: ${id}) and payment have been cancelled.`,
          "booking"
        );
      } catch (notifErr) {
        console.error("Notification creation error:", notifErr);
      }

      res.json({
        success: true,
        message: msg || "Booking & Payment cancelled successfully!",
      });
    });
  });
};

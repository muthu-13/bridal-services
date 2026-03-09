import { addContact, getAllContacts } from '../models/contactModel.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Submit a contact form and send confirmation email
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    console.log("Received contact form:", { name, email, phone, message });

    // 1. Save to DB
    try {
      await addContact({ name, email, phone, message });
      console.log("Contact saved to DB.");
    } catch (dbErr) {
      console.error("Database error:", dbErr);
      return res.status(500).json({ message: "Error saving to database." });
    }

    // 2. Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Thanks for contacting us!',
      html: `
        <p>Hi ${name},</p>
        <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
        <p>Regards,<br/>Bridal Bliss</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully to:", email);
    } catch (emailErr) {
      console.error("Email sending error:", emailErr);
      return res.status(500).json({ message: "Error sending confirmation email." });
    }

    res.status(200).json({ message: 'Message submitted and email sent.' });

  } catch (error) {
    console.error('Unexpected error in submitContact:', error);
    res.status(500).json({ message: 'Something went wrong. Try again later.' });
  }
};

// Get all submitted contacts
export const getContacts = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Failed to fetch contacts." });
  }
};

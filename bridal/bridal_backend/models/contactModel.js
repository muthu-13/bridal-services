// models/contact.model.js
import db from '../config/db.js'; // use db instance from config

// Create a new contact entry
export const addContact = (contactData) => {
  return new Promise((resolve, reject) => {
    const { name, email, phone, message } = contactData;
const query = `
  INSERT INTO contact_form (name, email, phone, message)
  VALUES (?, ?, ?, ?)
`;


    db.query(query, [name, email, phone, message], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Get all contact submissions
export const getAllContacts = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM contact_form
      ORDER BY submitted_at DESC
    `;

    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

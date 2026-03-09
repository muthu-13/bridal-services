import db from '../config/db.js';

// ✅ Register for workshop
export const createWorkshopRegistration = (workshopId, data) => {
  const {
    userId, name, email, phone, city, language,
    experience, interest, source, comments
  } = data;

  const query = `
    INSERT INTO workshop_registrations 
    (workshop_id, user_id, name, email, phone, city, language, experience, interest, source, comments)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        workshopId, userId, name, email, phone, city, language,
        experience, interest, source, comments
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

// ✅ Admin – Get all registrations
export const getAllWorkshopsWithRegistrations = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT w.id as workshop_id, w.title, w.date, w.location, r.*
      FROM workshops w
      LEFT JOIN workshop_registrations r ON w.id = r.workshop_id
      ORDER BY w.date DESC, r.id ASC
    `;
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};


  
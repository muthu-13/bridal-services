import db from "../config/db.js"; // MySQL db connection

// ✅ Add a new offer
export const addOffer = (offerData) => {
  return new Promise((resolve, reject) => {
    const { title, description, discount, image_url, valid_until } = offerData;

    const query = `
      INSERT INTO offers (title, description, discount, image_url, valid_until)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [title, description, discount, image_url, valid_until],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

// ✅ Get all offers
export const getAllOffers = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM offers
      ORDER BY created_at DESC
    `;
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// ✅ Get active offers (valid only)
export const getActiveOffers = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM offers
      WHERE valid_until >= CURDATE()
      ORDER BY valid_until ASC
    `;
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// ✅ Delete offer by ID
export const deleteOffer = (id) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM offers WHERE id = ?`;
    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// ✅ Update offer by ID
export const updateOffer = (id, offerData) => {
  return new Promise((resolve, reject) => {
    const { title, description, discount, image_url, valid_until } = offerData;

    const query = `
      UPDATE offers
      SET title = ?, description = ?, discount = ?, image_url = ?, valid_until = ?
      WHERE id = ?
    `;

    db.query(
      query,
      [title, description, discount, image_url, valid_until, id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

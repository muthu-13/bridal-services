import db from '../config/db.js';

// ✅ Create workshop
const createWorkshop = (data, callback) => {
  const { title, description, date, time, duration, location, price, image_url } = data;

  const sql = `
    INSERT INTO workshops 
    (title, description, date, time, duration, location, price, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, description, date, time, duration, location, price, image_url], callback);
};

// ✅ Get all workshops
const getAllWorkshops = (callback) => {
  const sql = 'SELECT * FROM workshops ORDER BY date ASC';
  db.query(sql, callback);
};

// ✅ Get workshop by ID
const getWorkshopById = (id, callback) => {
  const sql = 'SELECT * FROM workshops WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result[0]); // return single object
  });
};

// ✅ Update workshop
const updateWorkshop = (id, data, callback) => {
  const { title, description, date, time, duration, location, price, image_url } = data;

  const sql = `
    UPDATE workshops SET 
      title = ?, description = ?, date = ?, time = ?, duration = ?, 
      location = ?, price = ?, image_url = ?
    WHERE id = ?
  `;

  db.query(sql, [title, description, date, time, duration, location, price, image_url, id], callback);
};

// ✅ Delete workshop
const deleteWorkshop = (id, callback) => {
  db.query('DELETE FROM workshops WHERE id = ?', [id], callback);
};

// ✅ Export everything as default
export default {
  createWorkshop,
  getAllWorkshops,
  getWorkshopById,
  updateWorkshop,
  deleteWorkshop
};

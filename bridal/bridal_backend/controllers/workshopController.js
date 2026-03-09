import WorkshopModel from '../models/workshopModel.js';

// ✅ Create a new workshop
export const createWorkshop = (req, res) => {
  const data = req.body;

  WorkshopModel.createWorkshop(data, (err, result) => {
    if (err) {
      console.error('Error creating workshop:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Workshop created', id: result.insertId });
  });
};

// ✅ Get all workshops
export const getAllWorkshops = (req, res) => {
  WorkshopModel.getAllWorkshops((err, results) => {
    if (err) {
      console.error('Error fetching workshops:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
};

// ✅ Get a single workshop by ID
export const getWorkshopById = (req, res) => {
  const id = req.params.id;

  WorkshopModel.getWorkshopById(id, (err, workshop) => {
    if (err) {
      console.error('Error fetching workshop:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }
    res.status(200).json(workshop);
  });
};

// ✅ Update a workshop
export const updateWorkshop = (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  WorkshopModel.updateWorkshop(id, updatedData, (err, result) => {
    if (err) {
      console.error('Error updating workshop:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Workshop not found' });
    }
    res.status(200).json({ message: 'Workshop updated' });
  });
};

// ✅ Delete a workshop
export const deleteWorkshop = (req, res) => {
  const id = req.params.id;

  WorkshopModel.deleteWorkshop(id, (err, result) => {
    if (err) {
      console.error('Error deleting workshop:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Workshop not found' });
    }
    res.status(200).json({ message: 'Workshop deleted' });
  });
};

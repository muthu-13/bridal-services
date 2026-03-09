import {
  createWorkshopRegistration,
  getAllWorkshopsWithRegistrations,
 
  
} from '../models/workshopRegistrationModel.js';

// Controller: Register user for a workshop
export const registerForWorkshop = async (req, res) => {
  const { id } = req.params; // workshopId
  try {
    const userId = req.user?.id || req.body.userId;

    const registrationData = {
      userId,
      ...req.body
    };

    await createWorkshopRegistration(id, registrationData);
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register' });
  }
};

// Controller: Get all workshops with all registrations (Admin)
export const getAllWorkshopsRegistrationsHandler = async (req, res) => {
  try {
    const results = await getAllWorkshopsWithRegistrations();

    const grouped = results.reduce((acc, row) => {
      const workshopId = row.workshop_id;
      if (!acc[workshopId]) {
        acc[workshopId] = {
          id: workshopId,
          title: row.title,
          date: row.date,
          location: row.location,
          registrations: []
        };
      }
      if (row.id) {
        acc[workshopId].registrations.push({
          id: row.id,
          userId: row.user_id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          city: row.city,
          language: row.language,
          experience: row.experience,
          interest: row.interest,
          source: row.source,
          comments: row.comments
        });
      }
      return acc;
    }, {});

    res.status(200).json(Object.values(grouped));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
};


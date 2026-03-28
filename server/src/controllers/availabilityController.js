const Availability = require('../models/availability');

const availabilityController = {
  async get(req, res, next) {
    try {
      const availability = await Availability.findAll();
      res.json(availability);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { schedules } = req.body;
      if (!schedules || !Array.isArray(schedules)) {
        return res.status(400).json({ error: 'Schedules array is required' });
      }
      const updated = await Availability.bulkUpdate(schedules);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = availabilityController;

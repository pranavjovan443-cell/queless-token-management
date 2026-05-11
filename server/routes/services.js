const express = require('express');
const Service = require('../models/Service');
const router = express.Router();

// Get all active services
router.get('/', async (req, res) => {
  try {
    // Mock data fallback if database is disconnected
    if (require('mongoose').connection.readyState !== 1) {
      return res.json([
        { _id: 'mock1', name: 'General Consultation', isActive: true },
        { _id: 'mock2', name: 'Priority Service', isActive: true },
        { _id: 'mock3', name: 'Technical Support', isActive: true }
      ]);
    }
    
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Add service
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const service = new Service({ name, description });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Deactivate service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      service.isActive = false;
      await service.save();
      res.json({ message: 'Service deactivated' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

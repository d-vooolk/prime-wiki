const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// Get car information by brand, model, and generation
router.get('/:brand/:model/:generation', async (req, res) => {
  try {
    const { brand, model, generation } = req.params;
    const car = await Car.findOne({
      where: {
        brand,
        model,
        generation: parseInt(generation)
      }
    });

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new car entry
router.post('/', async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: 'Error creating car', error: error.message });
  }
});

// Update car information
router.put('/:brand/:model/:generation', async (req, res) => {
  try {
    const { brand, model, generation } = req.params;
    const [updated] = await Car.update(req.body, {
      where: {
        brand,
        model,
        generation: parseInt(generation)
      }
    });

    if (!updated) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const updatedCar = await Car.findOne({
      where: {
        brand,
        model,
        generation: parseInt(generation)
      }
    });

    res.json(updatedCar);
  } catch (error) {
    res.status(400).json({ message: 'Error updating car', error: error.message });
  }
});

module.exports = router; 
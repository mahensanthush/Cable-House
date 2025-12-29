const express = require('express');
const router = express.Router();
const Cable = require('../models/Cable');
const protectAdmin = require('../middleware/auth'); 


router.get('/', async (req, res) => {
  try {
    const cables = await Cable.find();
    res.json(cables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', protectAdmin, async (req, res) => {
  const cable = new Cable(req.body);
  try {
    const savedCable = await cable.save();
    res.status(201).json(savedCable);
  } catch (err) {
    res.status(400).json({ message: "Failed to save: " + err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const cable = await Cable.findByIdAndDelete(req.params.id);
    if (!cable) return res.status(404).json({ message: "Blueprint not found" });
    res.json({ message: "Blueprint deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error during deletion" });
  }
});

module.exports = router;
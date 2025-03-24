const mongoose = require('mongoose');

const Farmer = require('../models/farmerModel');
exports.createFarmer = async (req, res) => {
    try {
        const farmer = new Farmer(req.body);
        await farmer.save();
        res.status(201).json(farmer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.getAllFarmers = async (req, res) => {
    const farmers = await Farmer.find();
    res.json(farmers);
};
exports.updateFarmer = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFarmer = await Farmer.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!updatedFarmer) {
            return res.status(404).json({ error: "Farmer record not found" });
        }

        res.json(updatedFarmer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete Farmer record
exports.deleteFarmer = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFarmer = await Farmer.findByIdAndDelete(id);

        if (!deletedFarmer) {
            return res.status(404).json({ error: "Farmer record not found" });
        }

        res.json({ message: "Farmer record deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
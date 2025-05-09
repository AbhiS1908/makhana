const mongoose = require('mongoose');

const SutaFarmerSchema = new mongoose.Schema({
    farmerStockId: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerStock', required: true },
    quantity: { type: Number },
    ratePerKg: { type: Number},
    count: { type: Number },
    totalCost: { type: Number, default: 0 } // This will be auto-calculated
});

// Middleware to auto-calculate totalCost before saving
SutaFarmerSchema.pre('save', function(next) {
    this.totalCost = this.quantity * this.ratePerKg;
    next();
});

module.exports = mongoose.model('SutaFarmer', SutaFarmerSchema);
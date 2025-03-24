const mongoose = require('mongoose');

const FarmerProductEntrySchema = new mongoose.Schema({
    farmerStockDetailsId: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerStockDetails', required: true },
    productInfo: { type: String, required: true },
    ratePerKg: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalCost: { type: Number } // Auto-calculated
});

// Auto-calculate totalCost before saving
FarmerProductEntrySchema.pre('save', function (next) {
    this.totalCost = this.ratePerKg * this.quantity;
    next();
});

module.exports = mongoose.model('FarmerProductEntry', FarmerProductEntrySchema);

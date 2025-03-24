const mongoose = require('mongoose');

const VendorProductEntrySchema = new mongoose.Schema({
    vendorStockDetailsId: { type: mongoose.Schema.Types.ObjectId, ref: 'VendorStockDetails', required: true },
    productInfo: { type: String, required: true },
    ratePerKg: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalCost: { type: Number } // Auto-calculated
});

// Auto-calculate totalCost before saving
VendorProductEntrySchema.pre('save', function (next) {
    this.totalCost = this.ratePerKg * this.quantity;
    next();
});

module.exports = mongoose.model('VendorProductEntry', VendorProductEntrySchema);

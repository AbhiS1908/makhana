const mongoose = require('mongoose');

const ProductEntrySchema = new mongoose.Schema({
    cashStockDetailsId: { type: mongoose.Schema.Types.ObjectId, ref: 'CashStockDetails', required: true },
    productInfo: { type: String, required: true },
    ratePerKg: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalCost: { type: Number } // Auto-calculated
});

// Auto-calculate totalCost before saving
ProductEntrySchema.pre('save', function (next) {
    this.totalCost = this.ratePerKg * this.quantity;
    next();
});

module.exports = mongoose.model('ProductEntry', ProductEntrySchema);

const mongoose = require('mongoose');

const VendorSegregateSchema = new mongoose.Schema({
    vendorStockId: { type: mongoose.Schema.Types.ObjectId, ref: 'VendorStock', required: true },
    percentage: String,
    makhana: String,
    totalWeight: Number,
    ratePerKg: String,
    finalPrice: Number,
    transportationCharge: String,
    totalPriceStandard: Number,
    totalPriceFinal: Number,
});
module.exports = mongoose.model('VendorSegregate', VendorSegregateSchema);
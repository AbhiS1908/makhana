const mongoose = require('mongoose');

const FarmerSegregateSchema = new mongoose.Schema({
    farmerStockId: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerStock', required: true },
    percentage: String,
    makhana: String,
    totalWeight: Number,
    ratePerKg: String,
    finalPrice: Number,
    transportationCharge: String,
    totalPriceStandard: Number,
    totalPriceFinal: Number,
});
module.exports = mongoose.model('FarmerSegregate', FarmerSegregateSchema);
const mongoose = require('mongoose');

const CashSegregateSchema = new mongoose.Schema({
    cashStockId: { type: mongoose.Schema.Types.ObjectId, ref: 'CashStock', required: true },
    percentage: String,
    makhana: String,
    totalWeight: Number,
    ratePerKg: String,
    finalPrice: Number,
    transportationCharge: String,
    totalPriceStandard: Number,
    totalPriceFinal: Number,
});
module.exports = mongoose.model('CashSegregate', CashSegregateSchema);
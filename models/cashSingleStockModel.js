const mongoose = require('mongoose');

const CashSingleStockSchema = new mongoose.Schema({
    cashStockId: { type: mongoose.Schema.Types.ObjectId, ref: 'CashStock', required: true },
    purchaseDate: String,
    cashName: String,
    bagSrNo: String,
    bagWeight: String,
    purchaseRate: String,
    totalValue: Number,
    actualValue: Number,
    valueDiff: Number,
});
module.exports = mongoose.model('CashSingleStock', CashSingleStockSchema);
const mongoose = require('mongoose');

const FarmerSingleStockSchema = new mongoose.Schema({
    farmerStockId: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerStock', required: true },
    purchaseDate: String,
    farmerName: String,
    bagSrNo: String,
    bagWeight: String,
    purchaseRate: String,
    totalValue: Number,
    actualValue: Number,
    valueDiff: Number,
});
module.exports = mongoose.model('FarmerSingleStock', FarmerSingleStockSchema);
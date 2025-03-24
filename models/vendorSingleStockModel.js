const mongoose = require('mongoose');

const VendorSingleStockSchema = new mongoose.Schema({
    vendorStockId: { type: mongoose.Schema.Types.ObjectId, ref: 'VendorStock', required: true },
    purchaseDate: String,
    vendorName: String,
    bagSrNo: String,
    bagWeight: String,
    purchaseRate: String,
    totalValue: Number,
    actualValue: Number,
    valueDiff: Number,
});
module.exports = mongoose.model('VendorSingleStock', VendorSingleStockSchema);
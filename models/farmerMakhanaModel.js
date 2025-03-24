const mongoose = require('mongoose');

const FarmerMakhanaSchema = new mongoose.Schema({
    farmerStockId: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerStock', required: true },
    makhana: { type: String, enum: ['6 Sutta', '5 Sutta', '4 Sutta', '3 Sutta', 'Others', 'Waste', 'Mixing'], required: true },
    quantity: { type: Number, required: true },
    bagCount: { type: Number, required: true },
    ratePerKg: { type: Number },
    totalCost: { type: Number },
    mixingDetails: [{
        productInfo: { type: String, enum: ['6 Sutta', '5 Sutta', '4 Sutta', '3 Sutta', 'Others', 'Waste'] },
        ratePerKgSmall: { type: Number },
        quantitySmall: { type: Number },
    }],
    weight1: { type: Number, default: 0 },
    weight2: { type: Number, default: 0 },
    weight3: { type: Number, default: 0 },
    weight4: { type: Number, default: 0 },
    weight5: { type: Number, default: 0 },
    weight6: { type: Number, default: 0 },
    finalWeight1: { type: Number, default: 0 },
    finalWeight2: { type: Number, default: 0 },
    finalWeight3: { type: Number, default: 0 },
    finalWeight4: { type: Number, default: 0 },
    finalWeight5: { type: Number, default: 0 },
    finalWeight6: { type: Number, default: 0 },
});

module.exports = mongoose.model('FarmerMakhana', FarmerMakhanaSchema);
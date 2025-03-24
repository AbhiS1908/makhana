const mongoose = require('mongoose');

const VendorStockDetailsSchema = new mongoose.Schema({
    vendorStockId: { type: mongoose.Schema.Types.ObjectId, ref: 'VendorStock', required: true },
    totalMaterialCost: { type: Number },
    rapperCost: { type: Number},
    labourCost: { type: Number},
    adminExpense: { type: Number },
    finalCost: { type: Number }, // Auto-calculated
    totalMaterialWeight: { type: Number },
    plasticWeight: { type: Number },
    totalWeight: { type: Number }, // Auto-calculated
    packetCount: { type: Number }, // User input
    totalCalculatedCost: { type: Number }, // Auto-calculated
    totalCalculatedWeight: { type: Number }, // Auto-calculated
    finalPrices: [{ type: Number }],
    weight1: { type: Number }, // For 6 sutta
    weight2: { type: Number }, // For 5 sutta
    weight3: { type: Number }, // For 4 sutta
    weight4: { type: Number }, // For 3 sutta
    weight5: { type: Number }, // For others
    weight6: { type: Number },  // For waste
    finalWeight1: { type: Number }, // For 6 sutta
    finalWeight2: { type: Number }, // For 6 sutta
    finalWeight3: { type: Number }, // For 6 sutta
    finalWeight4: { type: Number }, // For 6 sutta
    finalWeight5: { type: Number }, // For 6 sutta
    finalWeight6: { type: Number }, // For 6 sutta

});

// Pre-save hook to auto-calculate values
VendorStockDetailsSchema.pre('save', function (next) {
    this.finalCost = this.totalMaterialCost + this.rapperCost + this.labourCost + this.adminExpense;
    this.totalWeight = this.totalMaterialWeight + this.plasticWeight;
    this.totalCalculatedCost = this.totalWeight * this.packetCount;
    this.totalCalculatedWeight = this.totalWeight * this.packetCount;
    next();
});

module.exports = mongoose.model('VendorStockDetails', VendorStockDetailsSchema);

const mongoose = require('mongoose');

const FarmerFormSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    farmerName: String,
    companyName: String,
    companyAddress: String,
    gstinSelf: String,
    stateName: String,
    stateCode: String,
    email: String,
    sellerName: String,
    sellerAddress: String,
    gstinPurchase: String,
    poNo: String,
    date: Date,
    remarks: String,
    transport: String,
    vehicleNo: String,
    eDate: Date,
    invoiceDate: Date,
    eBill: String,
    unitType: { type: String, enum: ['bag', 'kg'], required: true }, // Dropdown field
    product: String,
    transportationCost: String,
    adminCost: String,



});

module.exports = mongoose.model('FarmerForm', FarmerFormSchema);

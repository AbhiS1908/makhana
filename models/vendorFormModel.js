const mongoose = require('mongoose');

const VendorFormSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    vendorName: String,
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
    unitType: { type: String, enum: ['bag', 'kg'], required: true },
    product: String,
    transportationCost: String,
    adminCost: String,



});

module.exports = mongoose.model('VendorForm', VendorFormSchema);

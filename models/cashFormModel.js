const mongoose = require('mongoose');

const CashFormSchema = new mongoose.Schema({
    cashId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cash', required: true },
    cashName: String,
    companyName: String,
    companyAddress: String,
    gstinSelf: String,
    stateName: String,
    stateCode: String,
    email: String,
    sellerName: String,
    sellerAddress: String,
    gstinPurchase: String,
    transportationCost: String,
    adminCost: String,
    poNo: String,
    date: Date,
    remarks: String,
    transport: String,
    vehicleNo: String,
    eDate: Date,
    invoiceDate: Date,
    eBill: String,
    unitType: { type: String, enum: ['bag', 'kg'], required: true },
    product: String

});

module.exports = mongoose.model('CashForm', CashFormSchema);

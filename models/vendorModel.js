const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    name: String,
    gst: { type: String, enum: ['registered', 'unregistered'] },
    gstNumber: String,
    address: String,
    phoneNumber: String,
    email: String
});
module.exports = mongoose.model('Vendor', VendorSchema);
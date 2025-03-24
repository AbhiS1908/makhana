const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
    name: String,
    village: String,
    plotNumber: String,
    district: String,
    post: String,
    state: String,
    pincode: String
});
module.exports = mongoose.model('Farmer', FarmerSchema);
const mongoose = require('mongoose');
const CashSchema = new mongoose.Schema({
    name: String,
    address: String
});
module.exports = mongoose.model('Cash', CashSchema);
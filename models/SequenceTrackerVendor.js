const mongoose = require('mongoose');

const SequenceTrackerVendorSchema = new mongoose.Schema({
    date: { type: Date, required: true }, // Date part of the PO number
    stateCode: { type: String, required: true }, // State code (e.g., 'B', 'D')
    lastSequence: { type: String, required: true }, // Last used sequence (e.g., 'AA', 'AB')
});

module.exports = mongoose.model('SequenceTrackerVendor', SequenceTrackerVendorSchema);
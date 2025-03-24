const Vendor = require('../models/vendorModel');
exports.createVendor = async (req, res) => {
    try {
        const vendor = new Vendor(req.body);
        await vendor.save();
        res.status(201).json(vendor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.getAllVendors = async (req, res) => {
    const vendors = await Vendor.find();
    res.json(vendors);
};
exports.updateVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedVendor = await Vendor.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!updatedVendor) {
            return res.status(404).json({ error: "Vendor record not found" });
        }

        res.json(updatedVendor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete Vendor record
exports.deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVendor = await Vendor.findByIdAndDelete(id);

        if (!deletedVendor) {
            return res.status(404).json({ error: "Vendor record not found" });
        }

        res.json({ message: "Vendor record deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

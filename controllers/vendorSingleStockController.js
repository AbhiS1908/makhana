const VendorStock = require('../models/vendorStockModel');
const VendorSingleStock = require('../models/vendorSingleStockModel');

// Create a Cash Form linked to Cash ID
exports.createVendorSingleStock = async (req, res) => {
    try {
        const { vendorStockId, purchaseDate, bagSrNo, bagWeight, purchaseRate, totalValue, actualValue, valueDiff } = req.body;
        
        const vendor = await VendorStock.findById(vendorStockId);
        if (!vendor) {
            return res.status(404).json({ error: 'Cash not found' });
        }

        const vendorSingleStock = new VendorSingleStock({
            vendorStockId,
            vendorName: vendor.vendorName,
            purchaseDate, 
            bagSrNo,
            bagWeight,
            purchaseRate,
            totalValue,
            actualValue,
            valueDiff
           
        });

        await vendorSingleStock.save();
        res.status(201).json({ message: 'Cash Form created successfully', vendorSingleStock });
    } catch (error) {
        res.status(500).json({ error: 'Error creating Cash Form' });
    }
};

// Get all Cash Entries
exports.getAllVendorSingleStock = async (req, res) => {
    try {
        const vendorEntries = await VendorSingleStock.find();
        res.status(200).json(vendorEntries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Cash entries' });
    }
};

// Get Cash Form by Cash ID
// exports.getVendorSingleStockByVendorId = async (req, res) => {
//     try {
//         const { vendorStockId } = req.params;
//         const vendorSingleStock = await VendorSingleStock.findOne({ vendorStockId }).populate('cashId');
//         if (!vendorSingleStock) {
//             return res.status(404).json({ error: 'Cash Form not found' });
//         }
//         res.status(200).json(vendorSingleStock);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching Cash Form' });
//     }
// };

exports.getVendorSingleStockByVendorId = async (req, res) => {
    try {
        const { vendorStockId } = req.params;

        // Fetch all cashStock records related to the given cashFormId
        const vendorSingleStock = await VendorSingleStock.find({ vendorStockId }).populate('vendorStockId');

        if (!vendorSingleStock || vendorSingleStock.length === 0) {
            return res.status(404).json({ error: 'No Cash Stock entries found for this Cash Form ID' });
        }

        // Map the data to extract only required fields
        const formattedData = vendorSingleStock.map(stock => ({
            _id: stock._id,
            vendorStockId: stock.vendorStockId._id,
            vendorName: stock.vendorName,
            purchaseDate: stock.purchaseDate, 
            bagSrNo: stock.bagSrNo,
            bagWeight: stock.bagWeight,
            purchaseRate: stock.purchaseRate,
            totalValue: stock.totalValue,
            actualValue: stock.actualValue,
            valueDiff: stock.valueDiff
        }));

        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Cash Stock entries', details: error.message });
    }
};

// Update a Cash Form
exports.updateVendorSingleStock = async (req, res) => {
    try {
        const { id } = req.params; // Use the document's unique _id

        const updatedvendorSingleStock = await VendorSingleStock.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedvendorSingleStock) {
            return res.status(404).json({ error: 'Cash Form not found' });
        }

        res.status(200).json({ message: 'Cash Form updated successfully', updatedvendorSingleStock });
    } catch (error) {
        res.status(500).json({ error: 'Error updating Cash Form' });
    }
};


// Delete a Cash Entry and associated Cash Form
exports.deleteVendorSingleStock = async (req, res) => {
    try {
        const { id } = req.params; // Use the document's unique _id

        const deletedVendorSingleStock = await VendorSingleStock.findByIdAndDelete(id);
        if (!deletedVendorSingleStock) {
            return res.status(404).json({ error: 'Cash Form not found' });
        }

        res.status(200).json({ message: 'Cash Form deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting Cash Form' });
    }
};


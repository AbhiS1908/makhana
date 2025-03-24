const FarmerStock = require('../models/farmerStockModel');
const FarmerSingleStock = require('../models/farmerSingleStockModel');

// Create a Cash Form linked to Cash ID
exports.createFarmerSingleStock = async (req, res) => {
    try {
        const { farmerStockId, purchaseDate, bagSrNo, bagWeight, purchaseRate, totalValue, actualValue, valueDiff } = req.body;
        
        const farmer = await FarmerStock.findById(farmerStockId);
        if (!farmer) {
            return res.status(404).json({ error: 'Cash not found' });
        }

        const farmerSingleStock = new FarmerSingleStock({
            farmerStockId,
            farmerName: farmer.farmerName,
            purchaseDate, 
            bagSrNo,
            bagWeight,
            purchaseRate,
            totalValue,
            actualValue,
            valueDiff
           
        });

        await farmerSingleStock.save();
        res.status(201).json({ message: 'Cash Form created successfully', farmerSingleStock });
    } catch (error) {
        res.status(500).json({ error: 'Error creating Cash Form' });
    }
};

// Get all Cash Entries
exports.getAllFarmerSingleStock = async (req, res) => {
    try {
        const farmerEntries = await FarmerSingleStock.find();
        res.status(200).json(farmerEntries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Cash entries' });
    }
};

// Get Cash Form by Cash ID
// exports.getFarmerSingleStockByFarmerId = async (req, res) => {
//     try {
//         const { farmerStockId } = req.params;
//         const farmerSingleStock = await FarmerSingleStock.findOne({ farmerStockId }).populate('cashId');
//         if (!farmerSingleStock) {
//             return res.status(404).json({ error: 'Cash Form not found' });
//         }
//         res.status(200).json(farmerSingleStock);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching Cash Form' });
//     }
// };

exports.getFarmerSingleStockByFarmerId = async (req, res) => {
    try {
        const { farmerStockId } = req.params;

        // Fetch all cashStock records related to the given cashFormId
        const farmerSingleStock = await FarmerSingleStock.find({ farmerStockId }).populate('farmerStockId');

        if (!farmerSingleStock || farmerSingleStock.length === 0) {
            return res.status(404).json({ error: 'No Cash Stock entries found for this Cash Form ID' });
        }

        // Map the data to extract only required fields
        const formattedData = farmerSingleStock.map(stock => ({
            _id: stock._id,
            farmerStockId: stock.farmerStockId._id,
            farmerName: stock.farmerName,
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
exports.updateFarmerSingleStock = async (req, res) => {
    try {
        const { id } = req.params; // Use the document's unique _id

        const updatedFarmerSingleStock = await FarmerSingleStock.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedFarmerSingleStock) {
            return res.status(404).json({ error: 'Cash Form not found' });
        }

        res.status(200).json({ message: 'Cash Form updated successfully', updatedFarmerSingleStock });
    } catch (error) {
        res.status(500).json({ error: 'Error updating Cash Form' });
    }
};


// Delete a Cash Entry and associated Cash Form
exports.deleteFarmerSingleStock = async (req, res) => {
    try {
        const { id } = req.params; // Use the document's unique _id

        const deletedFarmerSingleStock = await FarmerSingleStock.findByIdAndDelete(id);
        if (!deletedFarmerSingleStock) {
            return res.status(404).json({ error: 'Cash Form not found' });
        }

        res.status(200).json({ message: 'Cash Form deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting Cash Form' });
    }
};


const CashStock = require('../models/cashStockModel');
const CashSingleStock = require('../models/cashSingleStockModel');

// Create a Cash Form linked to Cash ID
exports.createCashSingleStock = async (req, res) => {
    try {
        const { cashStockId, purchaseDate, bagSrNo, bagWeight, purchaseRate, totalValue, actualValue, valueDiff } = req.body;
        
        const cash = await CashStock.findById(cashStockId);
        if (!cash) {
            return res.status(404).json({ error: 'Cash not found' });
        }

        const cashSingleStock = new CashSingleStock({
            cashStockId,
            cashName: cash.cashName,
            purchaseDate, 
            bagSrNo,
            bagWeight,
            purchaseRate,
            totalValue,
            actualValue,
            valueDiff
           
        });

        await cashSingleStock.save();
        res.status(201).json({ message: 'Cash Form created successfully', cashSingleStock });
    } catch (error) {
        res.status(500).json({ error: 'Error creating Cash Form' });
    }
};

// Get all Cash Entries
exports.getAllCashSingleStock = async (req, res) => {
    try {
        const cashEntries = await CashSingleStock.find();
        res.status(200).json(cashEntries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Cash entries' });
    }
};

// Get Cash Form by Cash ID
// exports.getCashSingleStockByCashId = async (req, res) => {
//     try {
//         const { cashStockId } = req.params;
//         const cashSingleStock = await CashSingleStock.findOne({ cashStockId }).populate('cashId');
//         if (!cashSingleStock) {
//             return res.status(404).json({ error: 'Cash Form not found' });
//         }
//         res.status(200).json(cashSingleStock);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching Cash Form' });
//     }
// };

exports.getCashSingleStockByCashId = async (req, res) => {
    try {
        const { cashStockId } = req.params;

        // Fetch all cashStock records related to the given cashFormId
        const cashSingleStocks = await CashSingleStock.find({ cashStockId }).populate('cashStockId');

        if (!cashSingleStocks || cashSingleStocks.length === 0) {
            return res.status(404).json({ error: 'No Cash Stock entries found for this Cash Form ID' });
        }

        // Map the data to extract only required fields
        const formattedData = cashSingleStocks.map(stock => ({
            _id: stock._id,
            cashStockId: stock.cashStockId._id,
            cashName: stock.cashName,
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
exports.updateCashSingleStock = async (req, res) => {
    try {
        const { id } = req.params; // Use the document's unique _id

        const updatedCashSingleStock = await CashSingleStock.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCashSingleStock) {
            return res.status(404).json({ error: 'Cash Form not found' });
        }

        res.status(200).json({ message: 'Cash Form updated successfully', updatedCashSingleStock });
    } catch (error) {
        res.status(500).json({ error: 'Error updating Cash Form' });
    }
};


// Delete a Cash Entry and associated Cash Form
exports.deleteCashSingleStock = async (req, res) => {
    try {
        const { id } = req.params; // Use the document's unique _id

        const deletedCashSingleStock = await CashSingleStock.findByIdAndDelete(id);
        if (!deletedCashSingleStock) {
            return res.status(404).json({ error: 'Cash Form not found' });
        }

        res.status(200).json({ message: 'Cash Form deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting Cash Form' });
    }
};


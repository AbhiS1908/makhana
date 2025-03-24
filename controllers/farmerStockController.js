const FarmerStock = require('../models/farmerStockModel');
const FarmerForm = require('../models/farmerFormModel');
const FarmerSingleStock = require('../models/farmerSingleStockModel');

// Create a Cash Form linked to Cash ID
exports.createFarmerStock = async (req, res) => {
    try {
        const { farmerFormId, product, particular, hsn, quantity, rate, pricePerKgBag, gst, amount, status, amountPaid, amountLeft, profit, weight } = req.body;
        
        const farmer = await FarmerForm.findById(farmerFormId);
        if (!farmer) {
            return res.status(404).json({ error: 'Cash not found' });
        }

        const farmerStock = new FarmerStock({
            farmerFormId,
            farmerName: farmer.farmerName,
            particular, 
            hsn,
            quantity,
            rate,
            pricePerKgBag,
            gst,
            amount,
            amountPaid,
            amountLeft,
            status,
            profit,
            weight,
            product: farmer.product,
            poNo: farmer.poNo
           
        });

        await farmerStock.save();
        res.status(201).json({ message: 'Cash Form created successfully', farmerStock });
    } catch (error) {
        res.status(500).json({ error: 'Error creating Cash Form' });
    }
};

// Get all Cash Entries
exports.getAllFarmerStock = async (req, res) => {
    try {
        const farmerEntries = await FarmerStock.find();
        res.status(200).json(farmerEntries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Cash entries' });
    }
};

exports.getFarmerStockById = async (req, res) => {
    try {
        const { id } = req.params;
        const farmerStock = await FarmerStock.findById(id);
        
        if (!farmerStock) {
            return res.status(404).json({ error: 'CashStock not found' });
        }

        res.status(200).json(farmerStock);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching CashStock' });
    }
};

// Get Cash Form by Cash ID
exports.getFarmerStockByFarmerId = async (req, res) => {
    try {
        const { farmerFormId } = req.params;

        // Fetch all cashStock records related to the given cashFormId
        const farmerStocks = await FarmerStock.find({ farmerFormId }).populate('farmerFormId');

        if (!farmerStocks || farmerStocks.length === 0) {
            return res.status(404).json({ error: 'No Cash Stock entries found for this Cash Form ID' });
        }

        // Map the data to extract only required fields
        const formattedData = farmerStocks.map(stock => ({
            _id: stock._id,
            farmerFormId: stock.farmerFormId._id, // Convert object to string ID
            particular: stock.particular,
            hsn: stock.hsn,
            quantity: stock.quantity,
            rate: stock.rate,
            gst: stock.gst,
            amount: stock.amount,
            status: stock.status,
            pricePerKgBag: stock.pricePerKgBag,
            amountPaid: stock.amountPaid,
            amountLeft: stock.amountLeft,
            weight: stock.weight,
            __v: stock.__v,
            actualValue: stock.actualValue,
            totalBagWeight: stock.totalBagWeight,
            totalPurchaseRate: stock.totalPurchaseRate,
            totalValue: stock.totalValue,
            valueDiff: stock.valueDiff,
            profit: stock.profit,
            finalTotalWeight: stock.finalTotalWeight,
            totalFinalPrice: stock.totalFinalPrice,
            finalTotalPriceStandard: stock.finalTotalPriceStandard,
            finalTotalPriceFinal: stock.finalTotalPriceFinal,
            finalPrices: stock.finalPrices,
            product: stock.product,
            totalWeight1: stock.totalWeight1,
            totalWeight2: stock.totalWeight2,
            totalWeight3: stock.totalWeight3,
            totalWeight4: stock.totalWeight4,
            totalWeight5: stock.totalWeight5,
            totalWeight6: stock.totalWeight6,
            poNo: stock.poNo

        }));

        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Cash Stock entries', details: error.message });
    }
};


// Update a Cash Form
exports.updateFarmerStock = async (req, res) => {
    try {
        const { id } = req.params; // Use the document's unique _id

        const updatedFarmerForm = await FarmerStock.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedFarmerForm) {
            return res.status(404).json({ error: 'Cash Form not found' });
        }

        res.status(200).json({ message: 'Cash Form updated successfully', updatedFarmerForm });
    } catch (error) {
        res.status(500).json({ error: 'Error updating Cash Form' });
    }
};


// Delete a Cash Entry and associated Cash Form
exports.deleteFarmerStock = async (req, res) => {
    try {
        const { id } = req.params; // Use the document's unique _id

        const deletedFarmerForm = await FarmerStock.findByIdAndDelete(id);
        if (!deletedFarmerForm) {
            return res.status(404).json({ error: 'Cash Form not found' });
        }

        res.status(200).json({ message: 'Cash Form deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting Cash Form' });
    }
};

exports.calculateTotalsForFarmerStock = async (req, res) => {
    try {
        const { farmerStockId } = req.params;
        
        // Find all cashSingleStock entries related to this cashStockId
        const farmerSingleStocks = await FarmerSingleStock.find({ farmerStockId });
        if (!farmerSingleStocks.length) {
            return res.status(404).json({ error: 'No stock entries found for this Cash Stock ID' });
        }

        // Calculate totals
        const totals = farmerSingleStocks.reduce((acc, stock) => {
            acc.totalBagWeight += parseFloat(stock.bagWeight) || 0;
            acc.totalPurchaseRate += parseFloat(stock.purchaseRate) || 0;
            acc.totalValue += stock.totalValue || 0;
            acc.actualValue += stock.actualValue || 0;
            acc.valueDiff += stock.valueDiff || 0;
            return acc;
        }, { totalBagWeight: 0, totalPurchaseRate: 0, totalValue: 0, actualValue: 0, valueDiff: 0 });

        // Update the CashStock document with calculated totals
        const updatedFarmerStock = await FarmerStock.findByIdAndUpdate(
            farmerStockId,
            { 
                totalBagWeight: totals.totalBagWeight,
                totalPurchaseRate: totals.totalPurchaseRate,
                totalValue: totals.totalValue,
                actualValue: totals.actualValue,
                valueDiff: totals.valueDiff
            },
            { new: true } // Return updated document
        );

        if (!updatedFarmerStock) {
            return res.status(404).json({ error: 'Cash Stock not found' });
        }

        res.status(200).json({ message: 'Totals calculated and updated successfully', updatedFarmerStock });
    } catch (error) {
        res.status(500).json({ error: 'Error calculating and updating totals', details: error.message });
    }
};


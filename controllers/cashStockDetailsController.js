const CashStock = require('../models/cashStockModel');
const CashStockDetails = require('../models/cashStockDetailsModel');

// Create new stock details
exports.createStockDetails = async (req, res) => {
    try {
        const { cashStockId, totalMaterialCost, rapperCost, labourCost, adminExpense, totalMaterialWeight, plasticWeight, packetCount, } = req.body;

        const cashStock = await CashStock.findById(cashStockId);
        if (!cashStock) {
            return res.status(404).json({ message: 'Cash Stock not found' });
        }

        const newStockDetails = new CashStockDetails({
            cashStockId,
            totalMaterialCost,
            rapperCost,
            labourCost,
            adminExpense,
            totalMaterialWeight,
            plasticWeight,
            packetCount,
            finalPrices: cashStock.finalPrices, // Pass the finalPrices from CashStock


        });

        await newStockDetails.save();
        res.status(201).json({ message: 'Stock details created successfully', data: newStockDetails });
    } catch (error) {
        res.status(500).json({ message: 'Error creating stock details', error });
    }
};

// Get stock details
exports.getStockDetails = async (req, res) => {
    try {
        const stockDetails = await CashStockDetails.findById(req.params.id).populate('cashStockId');
        if (!stockDetails) return res.status(404).json({ message: 'Stock details not found' });
        res.json(stockDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stock details', error });
    }
};

exports.getStockDetailsByCashStockId = async (req, res) => {
    try {
        const { cashStockId } = req.params;

        // Fetch all cashStock records related to the given cashFormId
        const cashSegregate = await CashStockDetails.find({ cashStockId }).populate('cashStockId');

        if (!cashSegregate || cashSegregate.length === 0) {
            return res.status(404).json({ error: 'No Cash Stock entries found for this Cash Form ID' });
        }

        // Map the data to extract only required fields
        const formattedData = cashSegregate.map(stock => ({
            _id: stock._id,
            cashStockId: stock.cashStockId._id,
            totalMaterialCost: stock.totalMaterialCost,
            rapperCost: stock.rapperCost, 
            labourCost: stock.labourCost,
            adminExpense: stock.adminExpense,
            totalMaterialWeight: stock.totalMaterialWeight,
            plasticWeight: stock.plasticWeight,
            packetCount: stock.packetCount,
            finalCost: stock.finalCost,
            totalWeight: stock.totalWeight,
            totalCalculatedCost: stock.totalCalculatedCost,
            totalCalculatedWeight: stock.totalCalculatedWeight,
            finalPrices: stock.finalPrices, // Include finalPrices in the response
            weight1: stock.weight1,
            weight2: stock.weight2,
            weight3: stock.weight3,
            weight4: stock.weight4,
            weight5: stock.weight5,
            weight6: stock.weight6,
            finalWeight1: stock.finalWeight1,
            finalWeight2: stock.finalWeight2,
            finalWeight3: stock.finalWeight3,
            finalWeight4: stock.finalWeight4,
            finalWeight5: stock.finalWeight5,
            finalWeight6: stock.finalWeight6

        }));

        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Cash Stock entries', details: error.message });
    }
};


// Update stock details
exports.updateStockDetails = async (req, res) => {
    try {
        const updatedDetails = await CashStockDetails.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedDetails) return res.status(404).json({ message: 'Stock details not found' });

        // Recalculate auto-generated fields
        updatedDetails.finalCost = updatedDetails.totalMaterialCost + updatedDetails.rapperCost + updatedDetails.labourCost + updatedDetails.adminExpense;
        updatedDetails.totalWeight = updatedDetails.totalMaterialWeight + updatedDetails.plasticWeight;
        updatedDetails.totalCalculatedCost = updatedDetails.totalMaterialCost * updatedDetails.packetCount;
        updatedDetails.totalCalculatedWeight = updatedDetails.totalWeight * updatedDetails.packetCount;
        updatedDetails.finalWeight1 = (updatedDetails.weight1 || 0) * updatedDetails.packetCount;
        updatedDetails.finalWeight2 = (updatedDetails.weight2 || 0) * updatedDetails.packetCount;
        updatedDetails.finalWeight3 = (updatedDetails.weight3 || 0) * updatedDetails.packetCount;
        updatedDetails.finalWeight4 = (updatedDetails.weight4 || 0) * updatedDetails.packetCount;
        updatedDetails.finalWeight5 = (updatedDetails.weight5 || 0) * updatedDetails.packetCount;
        updatedDetails.finalWeight6 = (updatedDetails.weight6 || 0) * updatedDetails.packetCount;

        await updatedDetails.save();
        res.json({ message: 'Stock details updated successfully', data: updatedDetails });
    } catch (error) {
        res.status(500).json({ message: 'Error updating stock details', error });
    }
};

// "Packets Out" functionality
exports.packetsOut = async (req, res) => {
    try {
        const stockDetails = await CashStockDetails.findById(req.params.id);
        if (!stockDetails) return res.status(404).json({ message: 'Stock details not found' });

        // Find related CashStock record
        const cashStock = await CashStock.findById(stockDetails.cashStockId);
        if (!cashStock) return res.status(404).json({ message: 'Cash stock not found' });

        // Deduct values from CashStock
        cashStock.finalTotalWeight -= stockDetails.totalCalculatedWeight;
        cashStock.totalWeight1 -= stockDetails.finalWeight1;
        cashStock.totalWeight2 -= stockDetails.finalWeight2;
        cashStock.totalWeight3 -= stockDetails.finalWeight3;
        cashStock.totalWeight4 -= stockDetails.finalWeight4;
        cashStock.totalWeight5 -= stockDetails.finalWeight5;
        cashStock.totalWeight6 -= stockDetails.finalWeight6;


        await cashStock.save();
        res.json({ message: 'Packets out updated successfully', cashStock });
    } catch (error) {
        res.status(500).json({ message: 'Error processing packets out', error });
    }
};

exports.packetsOutProduct = async (req, res) => {
    try {
        const stockDetails = await CashStockDetails.findById(req.params.id);
        if (!stockDetails) return res.status(404).json({ message: 'Stock details not found' });

        // Find related CashStock record
        const cashStock = await CashStock.findById(stockDetails.cashStockId);
        if (!cashStock) return res.status(404).json({ message: 'Cash stock not found' });

        // Deduct values from CashStock
        cashStock.quantity -= stockDetails.totalCalculatedWeight;

        await cashStock.save();
        res.json({ message: 'Packets out updated successfully', cashStock });
    } catch (error) {
        res.status(500).json({ message: 'Error processing packets out', error });
    }
};

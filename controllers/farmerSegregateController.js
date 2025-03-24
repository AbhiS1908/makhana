const FarmerStock = require('../models/farmerStockModel');
const FarmerSegregate = require('../models/farmerSegregateModel');

// Create a farmer Form linked to farmer ID
exports.createFarmerSegregate = async (req, res) => {
    try {
        const { farmerStockId, percentage, makhana, totalWeight, ratePerKg, finalPrice, transportationCharge, totalPriceStandard, totalPriceFinal } = req.body;

        const farmerStock = await FarmerStock.findById(farmerStockId);
        if (!farmerStock) {
            return res.status(404).json({ error: 'farmer Stock not found' });
        }

        const farmerSegregate = new FarmerSegregate({
            farmerStockId,
            percentage,
            makhana,
            totalWeight,
            ratePerKg,
            finalPrice,
            transportationCharge,
            totalPriceStandard,
            totalPriceFinal
        });

        await farmerSegregate.save();

        farmerStock.finalPrices.push(finalPrice);
        if (!farmerStock.totalWeight1) {
            farmerStock.totalWeight1 = totalWeight;
        } else if (!farmerStock.totalWeight2) {
            farmerStock.totalWeight2 = totalWeight;
        } else if (!farmerStock.totalWeight3) {
            farmerStock.totalWeight3 = totalWeight;
        } else if (!farmerStock.totalWeight4) {
            farmerStock.totalWeight4 = totalWeight;
        } else if (!farmerStock.totalWeight5) {
            farmerStock.totalWeight5 = totalWeight;
        } else if (!farmerStock.totalWeight6) {
            farmerStock.totalWeight6 = totalWeight;
        } else {
            return res.status(400).json({ error: 'All 6 totalWeight fields are already filled' });
        }
        await farmerStock.save();

        // Update totals in farmerStock
        const aggregation = await FarmerSegregate.aggregate([
            { $match: { farmerStockId: farmerStock._id } },
            {
                $group: {
                    _id: "$farmerStockId",
                    finalTotalWeight: { $sum: "$totalWeight" },
                    totalFinalPrice: { $sum: "$finalPrice" },
                    finalTotalPriceStandard: { $sum: "$totalPriceStandard" },
                    finalTotalPriceFinal: { $sum: "$totalPriceFinal" }
                }
            }
        ]);

        if (aggregation.length > 0) {
            await FarmerStock.findByIdAndUpdate(farmerStockId, {
                finalTotalWeight: aggregation[0].finalTotalWeight,
                totalFinalPrice: aggregation[0].totalFinalPrice,
                finalTotalPriceStandard: aggregation[0].finalTotalPriceStandard,
                finalTotalPriceFinal: aggregation[0].finalTotalPriceFinal
            });
        }

        res.status(201).json({ message: 'farmer Segregation created successfully', farmerSegregate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating Cash Segregation' });
    }
};

// Get all Cash Entries
exports.getAllFarmerSegregate = async (req, res) => {
    try {
        const farmerEntries = await FarmerSegregate.find();
        res.status(200).json(farmerEntries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Cash entries' });
    }
};

// Get Cash Form by Cash ID
// exports.getFarmerSegregateByFarmerId = async (req, res) => {
//     try {
//         const { farmerStockId } = req.params;
//         const farmerSegregate = await FarmerSegregate.findOne({ farmerStockId }).populate('cashId');
//         if (!farmerSegregate) {
//             return res.status(404).json({ error: 'Cash Form not found' });
//         }
//         res.status(200).json(farmerSegregate);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching Cash Form' });
//     }
// };

exports.getFarmerSegregateByFarmerId = async (req, res) => {
    try {
        const { farmerStockId } = req.params;

        // Fetch all cashStock records related to the given cashFormId
        const farmerSegregate = await FarmerSegregate.find({ farmerStockId }).populate('farmerStockId');

        if (!farmerSegregate || farmerSegregate.length === 0) {
            return res.status(404).json({ error: 'No Cash Stock entries found for this Cash Form ID' });
        }

        // Map the data to extract only required fields
        const formattedData = farmerSegregate.map(stock => ({
            _id: stock._id,
            farmerStockId: stock.farmerStockId._id,
            percentage: stock.percentage,
            makhana: stock.makhana, 
            totalWeight: stock.totalWeight,
            ratePerKg: stock.ratePerKg,
            finalPrice: stock.finalPrice,
            transportationCharge: stock.transportationCharge,
            totalPriceStandard: stock.totalPriceStandard,
            totalPriceFinal: stock.totalPriceFinal
        }));

        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Cash Stock entries', details: error.message });
    }
};

// Update a Cash Form
exports.updateFarmerSegregate = async (req, res) => {
    try {
        const { id } = req.params; // Use the document's unique _id

        const updatedFarmerSegregate = await FarmerSegregate.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedFarmerSegregate) {
            return res.status(404).json({ error: 'Cash Form not found' });
        }

        res.status(200).json({ message: 'Cash Form updated successfully', updatedFarmerSegregate });
    } catch (error) {
        res.status(500).json({ error: 'Error updating Cash Form' });
    }
};


// Delete a Cash Entry and associated Cash Form
exports.deleteFarmerSegregate = async (req, res) => {
    try {
        const { id } = req.params; // Use the document's unique _id

        const deletedFarmerSegregate = await FarmerSegregate.findByIdAndDelete(id);
        if (!deletedFarmerSegregate) {
            return res.status(404).json({ error: 'Cash Form not found' });
        }

        res.status(200).json({ message: 'Cash Form deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting Cash Form' });
    }
};


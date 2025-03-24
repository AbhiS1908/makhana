const Farmer = require('../models/farmerModel');
const FarmerForm = require('../models/farmerFormModel');
const SequenceTrackerFarmer = require('../models/SequenceTrackerFarmer'); // Import the SequenceTracker model

const generatePoNo = async (stateCode, date) => {
    try {
        const datePart = date.toISOString().slice(2, 10).replace(/-/g, ''); // Extract YYMMDD from the date
        const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Start of the day
        const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // End of the day

        // Find or create a sequence tracker for the given date and state code
        let sequenceTrackerFarmer = await SequenceTrackerFarmer.findOne({ date: { $gte: startOfDay, $lt: endOfDay }, stateCode });

        if (!sequenceTrackerFarmer) {
            // If no sequence exists for this date and state code, start with 'AA'
            sequenceTrackerFarmer = new SequenceTrackerFarmer({
                date: startOfDay,
                stateCode,
                lastSequence: 'AA',
            });
        } else {
            // Increment the sequence
            const lastSequence = sequenceTrackerFarmer.lastSequence;
            const firstChar = lastSequence[0]; // First character of the sequence
            const secondChar = lastSequence[1]; // Second character of the sequence

            if (secondChar === 'Z') {
                // If the second character is 'Z', increment the first character and reset the second to 'A'
                sequenceTrackerFarmer.lastSequence = String.fromCharCode(firstChar.charCodeAt(0) + 1) + 'A';
            } else {
                // Otherwise, increment the second character
                sequenceTrackerFarmer.lastSequence = firstChar + String.fromCharCode(secondChar.charCodeAt(0) + 1);
            }
        }

        // Save the updated sequence tracker
        await sequenceTrackerFarmer.save();

        // Generate the PO number
        return `${sequenceTrackerFarmer.lastSequence}${datePart}${stateCode}`;
    } catch (error) {
        console.error('Error generating PO number:', error);
        throw new Error('Failed to generate PO number');
    }
};

// Create a Cash Form linked to Cash ID
exports.createFarmerForm = async (req, res) => {
    try {
        const { farmerId, companyName, companyAddress, gstinSelf, stateName, stateCode, email, sellerName, sellerAddress, gstinPurchase, date, remarks, transport, vehicleNo, eDate, invoiceDate, eBill, unitType, product, transportationCost, adminCost } = req.body;

        // Validate required fields
        if (!farmerId || !stateCode || !date || !unitType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Find the farmer
        const farmer = await Farmer.findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }

        // Format the date
        const formattedDate = new Date(date);
        if (isNaN(formattedDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        // Generate the seller address
        const generatedSellerAddress = `${farmer.village}, Plot No: ${farmer.plotNumber}, ${farmer.district}, Post: ${farmer.post}, ${farmer.state} - ${farmer.pincode}`;

        // Generate the PO number
        const poNo = await generatePoNo(stateCode, formattedDate);

        // Create the farmer form
        const farmerForm = new FarmerForm({
            farmerId,
            farmerName: farmer.name,
            companyName,
            companyAddress,
            gstinSelf,
            stateName,
            stateCode,
            email,
            sellerName,
            sellerAddress: generatedSellerAddress,
            gstinPurchase,
            poNo,
            date: formattedDate,
            remarks,
            transport,
            vehicleNo,
            eDate,
            invoiceDate,
            eBill,
            unitType,
            product,
            transportationCost,
            adminCost
        });

        // Save the farmer form
        await farmerForm.save();

        res.status(201).json({ message: 'Farmer Form created successfully', farmerForm });
    } catch (error) {
        console.error('Error creating Farmer Form:', error);
        res.status(500).json({ error: 'Error creating Farmer Form', details: error.message });
    }
};

// Get all Cash Entries
exports.getAllFarmerForm = async (req, res) => {
    try {
        const farmerEntries = await FarmerForm.find();
        res.status(200).json(farmerEntries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Cash entries' });
    }
};

// Get Cash Form by Cash ID
// exports.getFarmerFormByFarmerId = async (req, res) => {
//     try {
//         const { farmerId } = req.params;
//         const farmerForm = await FarmerForm.findOne({ farmerId }).populate('cashId');
//         if (!farmerForm) {
//             return res.status(404).json({ error: 'Cash Form not found' });
//         }
//         res.status(200).json(farmerForm);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching Cash Form' });
//     }
// };

exports.getFarmerFormByFarmerId = async (req, res) => {
    try {
        const { farmerId } = req.params;

        // Fetch all cashStock records related to the given cashFormId
        const farmerForm = await FarmerForm.find({ farmerId }).populate('farmerId');

        if (!farmerForm || farmerForm.length === 0) {
            return res.status(404).json({ error: 'No Cash Stock entries found for this Cash Form ID' });
        }

        // Map the data to extract only required fields
        const formattedData = farmerForm.map(stock => ({
            _id: stock._id,
            farmerId: stock.farmerId._id,
            farmerName: stock.farmerName,
            companyName: stock.companyName,
            companyAddress: stock.companyAddress,
            gstinSelf: stock.gstinSelf,
            stateName: stock.stateName,
            stateCode: stock.stateCode,
            email: stock.email,
            sellerName: stock.sellerName,
            sellerAddress: stock.sellerAddress,
            gstinPurchase: stock.gstinPurchase,
            poNo: stock.poNo,
            date: stock.date,
            remarks: stock.remarks,
            transport: stock.transport,
            vehicleNo: stock.vehicleNo,
            eDate: stock.eDate,
            invoiceDate: stock.invoiceDate,
            eBill: stock.eBill,
            unitType: stock.unitType,
            product: stock.product,
            transportationCost: stock.transportationCost,
            adminCost: stock.adminCost
        }));

        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Cash Stock entries', details: error.message });
    }
};


// Update a Cash Form
exports.updateFarmerForm = async (req, res) => {
    try {
        const { id } = req.params; // Use the document's unique _id

        const updatedFarmerForm = await FarmerForm.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedFarmerForm) {
            return res.status(404).json({ error: 'Cash Form not found' });
        }

        res.status(200).json({ message: 'Cash Form updated successfully', updatedFarmerForm });
    } catch (error) {
        res.status(500).json({ error: 'Error updating Cash Form' });
    }
};


// Delete a Cash Entry and associated Cash Form
exports.deleteFarmerForm = async (req, res) => {
    try {
        const { id } = req.params; // Use the document's unique _id

        const deletedFarmerForm = await FarmerForm.findByIdAndDelete(id);
        if (!deletedFarmerForm) {
            return res.status(404).json({ error: 'Cash Form not found' });
        }

        res.status(200).json({ message: 'Cash Form deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting Cash Form' });
    }
};


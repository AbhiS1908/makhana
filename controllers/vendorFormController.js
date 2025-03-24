const Vendor = require('../models/vendorModel');
const VendorForm = require('../models/vendorFormModel');
const SequenceTrackerVendor = require('../models/SequenceTrackerVendor'); // Import the SequenceTracker model

const generatePoNo = async (stateCode, date) => {
    const datePart = date.toISOString().slice(2, 10).replace(/-/g, ''); // Extract YYMMDD from the date
    const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Start of the day
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // End of the day

    // Find or create a sequence tracker for the given date and state code
    let sequenceTrackerVendor = await SequenceTrackerVendor.findOne({ date: { $gte: startOfDay, $lt: endOfDay }, stateCode });

    if (!sequenceTrackerVendor) {
        // If no sequence exists for this date and state code, start with 'AA'
        sequenceTrackerVendor = new SequenceTrackerVendor({
            date: startOfDay,
            stateCode,
            lastSequence: 'AA',
        });
    } else {
        // Increment the sequence
        const lastSequence = sequenceTrackerVendor.lastSequence;
        const firstChar = lastSequence[0]; // First character of the sequence
        const secondChar = lastSequence[1]; // Second character of the sequence

        if (secondChar === 'Z') {
            // If the second character is 'Z', increment the first character and reset the second to 'A'
            sequenceTrackerVendor.lastSequence = String.fromCharCode(firstChar.charCodeAt(0) + 1) + 'A';
        } else {
            // Otherwise, increment the second character
            sequenceTrackerVendor.lastSequence = firstChar + String.fromCharCode(secondChar.charCodeAt(0) + 1);
        }
    }

    // Save the updated sequence tracker
    await sequenceTrackerVendor.save();

    // Generate the PO number
    return `${sequenceTrackerVendor.lastSequence}${datePart}${stateCode}`;
};

// Create a Cash Form linked to Cash ID
exports.createVendorForm = async (req, res) => {
    try {
        const { vendorId, companyName, companyAddress, gstinSelf, stateName, stateCode, email, sellerName, sellerAddress, gstinPurchase, date, remarks, transport, vehicleNo, eDate, invoiceDate, eBill, unitType,product, transportationCost, adminCost } = req.body;

        if (!vendorId || !stateCode || !date || !unitType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ error: 'Cash not found' });
        }

        const formattedDate = new Date(date);
        if (isNaN(formattedDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const poNo = await generatePoNo(stateCode, formattedDate);

        const vendorForm = new VendorForm({
            vendorId,
            vendorName: vendor.name, 
            companyName,
            companyAddress,
            gstinSelf,
            stateName,
            stateCode,
            email,
            sellerName,
            sellerAddress: vendor.address,
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

        await vendorForm.save();
        res.status(201).json({ message: 'Cash Form created successfully', vendorForm });
    } catch (error) {
        res.status(500).json({ error: 'Error creating Cash Form' });
    }
};

// Get all Cash Entries
exports.getAllVendorForm = async (req, res) => {
    try {
        const vendorEntries = await VendorForm.find();
        res.status(200).json(vendorEntries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Cash entries' });
    }
};

// Get Cash Form by Cash ID
// exports.getVendorFormByVendorId = async (req, res) => {
//     try {
//         const { vendorId } = req.params;
//         const vendorForm = await VendorForm.findOne({ vendorId }).populate('cashId');
//         if (!vendorForm) {
//             return res.status(404).json({ error: 'Cash Form not found' });
//         }
//         res.status(200).json(vendorForm);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching Cash Form' });
//     }
// };

exports.getVendorFormByVendorId = async (req, res) => {
    try {
        const { vendorId } = req.params;

        // Fetch all cashStock records related to the given cashFormId
        const vendorForm = await VendorForm.find({ vendorId }).populate('vendorId');

        if (!vendorForm || vendorForm.length === 0) {
            return res.status(404).json({ error: 'No Cash Stock entries found for this Cash Form ID' });
        }

        // Map the data to extract only required fields
        const formattedData = vendorForm.map(stock => ({
            _id: stock._id,
            vendorId: stock.vendorId._id,
            vendorName: stock.vendorName,
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
exports.updateVendorForm = async (req, res) => {
    try {
        const { id } = req.params; // Use the document's unique _id

        const updatedVendorForm = await VendorForm.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedVendorForm) {
            return res.status(404).json({ error: 'Cash Form not found' });
        }

        res.status(200).json({ message: 'Cash Form updated successfully', updatedVendorForm });
    } catch (error) {
        res.status(500).json({ error: 'Error updating Cash Form' });
    }
};


// Delete a Cash Entry and associated Cash Form
exports.deleteVendorForm = async (req, res) => {
    try {
        const { id } = req.params; // Use the document's unique _id

        const deletedVendorForm = await VendorForm.findByIdAndDelete(id);
        if (!deletedVendorForm) {
            return res.status(404).json({ error: 'Cash Form not found' });
        }

        res.status(200).json({ message: 'Cash Form deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting Cash Form' });
    }
};


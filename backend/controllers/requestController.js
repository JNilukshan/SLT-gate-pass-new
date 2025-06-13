import Request from '../models/requestModel.js';

const createRequest = async (req, res) => {
  try {
    // Extract common fields
    const {
      sender_name,
      designation,
      service_no,
      section,
      group_number,
      contact_number,
      outLocation,
      inLocation,
      executiveOfficer,
      receiverName,
      receiverContact,
      receiverGroup,
      receiverServiceNumber,
      vehicleNumber,
      byHand,
      ...itemsData
    } = req.body;

    // Validate byHand and vehicleNumber
    if (byHand === "No" && !vehicleNumber?.trim()) {
      return res.status(400).json({ 
        message: "Vehicle number is required when not delivering by hand" 
      });
    }
    
    if (byHand === "Yes" && vehicleNumber?.trim()) {
      return res.status(400).json({ 
        message: "Vehicle number should be empty when delivering by hand" 
      });
    }

    // Process items array from form data
    const items = [];
    const files = req.files || [];
    
    // Determine if we have multiple items or single item
    if (Array.isArray(itemsData.items)) {
      // Multiple items case
      itemsData.items.forEach((item, index) => {
        const newItem = {
          itemName: item.itemName,
          serialNo: item.serialNo,
          category: item.category,
          quantity: item.quantity,
          description: item.description,
          returnable: item.returnable,
          image: files.find(f => f.fieldname === `items[${index}][image]`)?.path || null
        };
        items.push(newItem);
      });
    } else if (itemsData.itemName) {
      // Single item case (legacy support)
      items.push({
        itemName: itemsData.itemName,
        serialNo: itemsData.serialNo,
        category: itemsData.category,
        quantity: itemsData.quantity,
        description: itemsData.description,
        returnable: itemsData.returnable,
        image: req.file?.path || null
      });
    }

    // Create new request with items array
    const newRequest = new Request({
      sender_name,
      designation,
      service_no,
      section,
      group_number,
      contact_number,
      items,
      outLocation,
      inLocation,
      executiveOfficer,
      receiverName,
      receiverContact,
      receiverGroup,
      receiverServiceNumber,
      vehicleNumber: byHand === "Yes" ? "" : vehicleNumber, // Ensure empty if byHand
      byHand,
      status: 'Pending',
      verify: 'Pending',
      dispatchStatus: 'Pending'
    });

    await newRequest.save();
    
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error: error.message });
  }
};

// Update request with validation for byHand and vehicleNumber
const updateRequest = async (req, res) => {
  const { id } = req.params;
  const { 
    itemName, 
    serialNo, 
    category, 
    description, 
    returnable, 
    outLocation, 
    inLocation, 
    executiveOfficer,
    vehicleNumber,
    byHand,
    receiverName,
    receiverContact,
    receiverGroup,
    receiverServiceNumber, 
    status,
    quantity 
  } = req.body;

  try {
    
    if (byHand === "No" && !vehicleNumber?.trim()) {
      return res.status(400).json({ 
        message: "Vehicle number is required when not delivering by hand" 
      });
    }
    
    if (byHand === "Yes" && vehicleNumber?.trim()) {
      return res.status(400).json({ 
        message: "Vehicle number should be empty when delivering by hand" 
      });
    }

    const updateData = {
      itemName, 
      serialNo, 
      category, 
      description, 
      returnable, 
      outLocation, 
      inLocation, 
      executiveOfficer,
      vehicleNumber: byHand === "Yes" ? "" : vehicleNumber, // Ensure empty if byHand
      byHand,
      receiverName,
      receiverContact,
      receiverGroup,
      receiverServiceNumber,
      status,
      quantity
    };

    // Handle image upload if available
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(updatedRequest);
  } catch (err) {
    res.status(500).json({ message: 'Error updating request', error: err });
  }
};

// Get all requests
const getRequests = async (req, res) => {
  try {
    const serviceNo = req.user.service_no;
    const requests = await Request.find({ service_no: serviceNo });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests', error: err });
  }
};

// Get request by ID
const getRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching request', error: err });
  }
};

// Delete request 
const deleteRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRequest = await Request.findByIdAndDelete(id);
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting request', error: err });
  }
};

export {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest
};
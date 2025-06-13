import User from '../models/userModel.js';
import Request from '../models/requestModel.js';

// Get all requests for executive approval
const getAllRequests = async (req, res) => {
    try {
      const requests = await Request.find({ status: "Approved" });
  
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };  


// Update request verification status
const updateRequestVerification = async (req, res) => {
    const { id } = req.params;
    const { verify } = req.body;
  
    try {
      const updatedRequest = await Request.findByIdAndUpdate(id, { verify }, { new: true });
  
      if (!updatedRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
  
      res.status(200).json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Error updating request verification", error: error.message });
    }
  };
  

// Get request details by ID (Only if Approved)
const getRequestById = async (req, res) => {
    try {
      const request = await Request.findOne({ _id: req.params.id, status: "Approved" });
  
      if (!request) {
        return res.status(404).json({ message: "Approved request not found" });
      }
  
      res.status(200).json(request);
    } catch (error) {
      res.status(500).json({ message: "Error fetching request", error: error.message });
    }
  };

  const assignRequestToOfficer = async (req, res) => {
    const { id } = req.params;
    const { assignedOfficer, assignedOfficerName, assignedOfficerServiceNo } = req.body;
  
    try {
      const updatedRequest = await Request.findByIdAndUpdate(
        id,
        { 
          assignedOfficer,
          assignedOfficerName,
          assignedOfficerServiceNo,
          assignedAt: new Date()
        },
        { new: true }
      );
  
      if (!updatedRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
  
      res.status(200).json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Error assigning request", error: error.message });
    }
  };
  

export { getAllRequests, updateRequestVerification, getRequestById, assignRequestToOfficer };



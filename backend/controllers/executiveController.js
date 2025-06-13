// controllers/executiveController.js
import Request from '../models/requestModel.js';
import User from '../models/userModel.js';
import { sendEmail } from '../../frontend/src/components/emails/emailService.js';

// Get all requests for executive approval
const getAllRequests = async (req, res) => {
  try {

    const executiveOfficer = req.user.sender_name; 
    const requests = await Request.find({ executiveOfficer: executiveOfficer });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests', error: err });
  }
};



// Update request status
// Update request status
const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status, comment } = req.body;

  try {
    // Validate that comment exists if status is Rejected
    if (status === "Rejected" && (!comment || comment.trim() === "")) {
      return res.status(400).json({ message: 'Executive comment is required when rejecting a request' });
    }

    // Get the request first to access sender information
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Get sender user details
    const senderUser = await User.findOne({ sender_name: request.sender_name });
    if (!senderUser) {
      return res.status(404).json({ message: 'Sender user not found' });
    }

    const updateData = { 
      status,
      ...(comment && { executiveComment: comment })
    };

    const updatedRequest = await Request.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Send email notifications
    try {
      if (status === "Approved") {
        // Email to sender
        await sendEmail(
          senderUser.email,
          'Your Request Has Been Approved',
          `Your item transfer request has been approved by the executive officer.\n\nRequest ID: ${id}\n\nThank you.`
        );

        // Find duty officer in the sender's branch location
        const dutyOfficers = await User.find({ 
          branch_location: senderUser.branch_location,
          role: 'duty_officer'
        });

        // Email to all duty officers in the branch
        for (const officer of dutyOfficers) {
          await sendEmail(
            officer.email,
            'New Approved Transfer Request',
            `A new item transfer request has been approved by the executive officer and requires your attention.\n\nRequest ID: ${id}\nSender: ${request.sender_name}\n\nPlease review the request in the system.`
          );
        }
      } else if (status === "Rejected") {
        // Email to sender for rejection
        await sendEmail(
          senderUser.email,
          'Your Request Has Been Rejected',
          `Your item transfer request has been rejected by the executive officer.\n\nRequest ID: ${id}\nReason: ${comment}\n\nPlease contact the executive officer for more information.`
        );
      }
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the whole request if email fails
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating request status', error });
  }
};

// Get request details by ID
const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: "Error fetching request", error });
  }
};

export { getAllRequests, updateRequestStatus, getRequestById };



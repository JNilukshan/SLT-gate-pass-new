import Request from '../models/requestModel.js';
import User from "../models/userModel.js";
import nodemailer from "nodemailer";
import { getRejectionEmailHTMLOut } from "../../frontend/src/components/emails/RejectionEmail.js";
import dotenv from 'dotenv';
import { getRejectionEmailHTMLIn } from '../../frontend/src/components/emails/RejectionEmailIn.js';
dotenv.config();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Get only verified requests
export const getVerifiedRequests = async (req, res) => {
  try {
    // Get logged-in user's branch_location
    const userBranch = req.user?.branch_location;

    if (!userBranch) {
      return res.status(400).json({ message: "Branch location missing from token" });
    }

    // Fetch only verified requests that match the branch location
    const verifiedRequests = await Request.find({
      verify: "Verified",
      $or: [{ inLocation: userBranch }, { outLocation: userBranch }],
    });
    
    res.status(200).json(verifiedRequests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching verified requests', error: err });
  }
};


// Get dispatch item bt Id
export const getDispatchById = async(req, res) => {
  const {id} = req.params;

  try{
    const request = await Request.findById(id);
    if(!request){
      return res.status(404).json({message: "Dispatch item not found"});
    }
    res.status(200).json(request);
  }catch(err){
    res.status(500).json({ message: 'Error fetching request', error: err });
  }
};

// update dispatch status
export const updateDispatchStatusOut = async (req, res) => {
  const { id } = req.params;
  const {
    dispatchStatusOut,
    employeeTypeOut,
    approverNameOut,
    serviceNoOut,
    nonSltNameOut,
    nicNumberOut,
    companyNameOut,
    commentOut,
  } = req.body;

  // Validate based on employee type
  if (employeeTypeOut === "SLT") {
    if (!approverNameOut || !serviceNoOut) {
      return res.status(400).json({ message: "Name and Service Number are required for SLT Employee!" });
    }
  } else if (employeeTypeOut === "Non-SLT") {
    if (!nonSltNameOut || !nicNumberOut || !companyNameOut) {
      return res.status(400).json({ message: "Name, NIC Number, and Company Name are required for Non-SLT Employee!" });
    }
  } else {
    return res.status(400).json({ message: "Invalid employee type!" });
  }
  if (dispatchStatusOut === "Rejected" && !commentOut) {
    return res.status(400).json({ message: "Comment is required for rejection!" });
  }

  try {
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Find sender email using service_no
    const sender = await User.findOne({ service_no: request.service_no });
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Common updates
    request.dispatchStatusOut = dispatchStatusOut;
    request.commentOut = commentOut || "";
    request.employeeTypeOut = employeeTypeOut;

    // SLT or Non-SLT specific fields
    if (employeeTypeOut === "SLT") {
      request.approverNameOut = approverNameOut;
      request.serviceNoOut = serviceNoOut;
    } else {
      request.nonSltNameOut = nonSltNameOut;
      request.nicNumberOut = nicNumberOut;
      request.companyNameOut = companyNameOut;
    }

    await request.save();

    if (dispatchStatusOut === "Rejected") {

      const emailHtml = getRejectionEmailHTMLOut({
        senderName: request.sender_name,
        itemDetails: request.items,
        comment: commentOut,
      });

      // Send Email
      await transporter.sendMail({
        from: "your-email@gmail.com",
        to: sender.email,
        subject: "Dispatch Request Rejected",
        html: emailHtml,
      });
    }

    res.status(200).json({ message: `Request ${dispatchStatusOut} successfully!` });
  } catch (error) {
    res.status(500).json({ message: "Error updating approval status", error });
  }
};

export const updateDispatchStatusIn = async (req, res) => {
  const { id } = req.params;
  const {
    dispatchStatusIn,
    employeeTypeIn,
    approverNameIn,
    serviceNoIn,
    nonSltNameIn,
    nicNumberIn,
    companyNameIn,
    commentIn,
  } = req.body;

  // Validation
  if (employeeTypeIn === "SLT") {
    if (!approverNameIn || !serviceNoIn) {
      return res.status(400).json({ message: "Name and Service Number are required for SLT Employee!" });
    }
  } else if (employeeTypeIn === "Non-SLT") {
    if (!nonSltNameIn || !nicNumberIn || !companyNameIn) {
      return res.status(400).json({ message: "Name, NIC Number, and Company Name are required for Non-SLT Employee!" });
    }
  } else {
    return res.status(400).json({ message: "Invalid employee type!" });
  }
  if (dispatchStatusIn === "Rejected" && !commentIn) {
    return res.status(400).json({ message: "Comment is required for rejection!" });
  }

  try {
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Find sender email using service_no
    const sender = await User.findOne({ service_no: request.service_no });
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Common updates
    request.dispatchStatusIn = dispatchStatusIn;
    request.commentIn = commentIn || "";
    request.employeeTypeIn = employeeTypeIn;

    // SLT or Non-SLT specific fields
    if (employeeTypeIn === "SLT") {
      request.approverNameIn = approverNameIn;
      request.serviceNoIn = serviceNoIn;
    } else {
      request.nonSltNameIn = nonSltNameIn;
      request.nicNumberIn = nicNumberIn;
      request.companyNameIn = companyNameIn;
    } 

    await request.save();

    if (dispatchStatusIn === "Rejected") {

      const emailHtml = getRejectionEmailHTMLIn({
        senderName: request.sender_name,
        itemDetails: request.items,
        comment: commentIn,
      });

      // Send Email
      await transporter.sendMail({
        from: "your-email@gmail.com",
        to: sender.email,
        subject: "Dispatch Request Rejected",
        html: emailHtml,
      });
    }

    res.status(200).json({ message: `Request ${dispatchStatusIn} successfully!` });
  } catch (error) {
    res.status(500).json({ message: "Error updating approval status", error });
  }
};

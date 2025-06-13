import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  serialNo: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true },
  returnable: { type: String, required: true },
  image: { type: String }
});

const requestSchema = new mongoose.Schema({

  // Add these fields for sender details
  sender_name: { type: String },
  designation: { type: String },
  service_no: { type: String },
  section: { type: String },
  group_number: { type: String },
  contact_number: { type: String },
  
  items: [itemSchema], // Array of items
  outLocation: { type: String, required: true },
  inLocation: { type: String, required: true },
  executiveOfficer: { type: String, required: true },
  receiverName: { type: String },
  receiverContact: { type: Number},
  receiverGroup: { type: String},
  receiverServiceNumber: { type: Number },
  vehicleNumber: { type: Number },
  byHand: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  verify: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  executiveComment: { type: String },
  dispatchStatusOut: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  dispatchStatusIn: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  approverNameOut: {  type: String },
  serviceNoOut: {  type: String },
  commentOut: { type: String },

  approverNameIn: {  type: String },
  serviceNoIn: {  type: String },
  commentIn: { type: String },

  employeeTypeOut: {type: String},
  employeeTypeIn: {type: String},

  nonSltNameOut: {type: String},
  nicNumberOut: {type: String},
  companyNameOut: {type: String},

  nonSltNameIn: {type: String},
  nicNumberIn: {type: String},
  companyNameIn: {type: String},

  assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedOfficerName: { type: String },
  assignedOfficerServiceNo: { type: String },
  assignedAt: { type: Date },

  returnedItems: [
  {
    item: Object,
    returnQuantity: Number,
  }],

}, {

  timestamps: true,
});

const Request = mongoose.model('Request', requestSchema);

export default Request;
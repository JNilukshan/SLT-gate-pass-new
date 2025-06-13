
import express from 'express';
import {
  getAllRequests,
  updateRequestVerification,
  getRequestById,
  assignRequestToOfficer
} from '../controllers/verifyController.js';

const router = express.Router();

// Get all requests for executive approval
router.get('/', getAllRequests);

// Update request status
router.put('/:id/verify', updateRequestVerification);

router.get('/:id', getRequestById);

router.put('/:id/assign', assignRequestToOfficer);

export default router;


// routes/executiveRoutes.js
import express from 'express';
import {
  getAllRequests,
  updateRequestStatus,
  getRequestById
} from '../controllers/executiveController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all requests for executive approval
router.get('/', verifyToken, getAllRequests);

// Update request status
router.put('/:id/status', verifyToken, updateRequestStatus);

// Get request details by ID
router.get('/:id', verifyToken, getRequestById);

export default router;

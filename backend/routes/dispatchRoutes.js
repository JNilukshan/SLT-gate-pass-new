import express from 'express';
import { getDispatchById, getVerifiedRequests, updateDispatchStatusIn, updateDispatchStatusOut } from '../controllers/dispatchController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/verified', verifyToken, getVerifiedRequests);
router.get('/getDispatchById/:id',getDispatchById);
router.put("/updateApprovalOut/:id", updateDispatchStatusOut);
router.put("/updateApprovalIn/:id", updateDispatchStatusIn);

export default router;

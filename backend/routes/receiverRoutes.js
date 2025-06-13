import express from 'express';

import { getRequestsForReceiver, saveReturnedItems } from '../controllers/receiverController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();


// Other routes remain the same
router.get('/', verifyToken, getRequestsForReceiver);
router.post('/:id/return-items', saveReturnedItems);

export default router;
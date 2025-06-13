import express from 'express';
import { deleteUserById, getAllUsers, getUserByServiceNumber, updateUserById } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);
// Get user by service number
router.get('/service/:serviceNo', getUserByServiceNumber);

export default router;
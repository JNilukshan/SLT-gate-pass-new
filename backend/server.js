import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import requestRoutes from './routes/requestRoutes.js';
import executiveRoutes from './routes/executiveRoutes.js';
import authRoutes from "./routes/authRoutes.js";
import verifyRoutes from './routes/verifyRoutes.js';
import dispatchRoutes from "./routes/dispatchRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import receiverRoutes from "./routes/receiverRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // User routes

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploads statically
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/requests', requestRoutes);
app.use('/api/executive', executiveRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/dispatch', dispatchRoutes);
app.use('/api/upload', uploadRoutes); // CSV upload route
app.use('/api/receiver', receiverRoutes);
app.use('/api/users', userRoutes); // User routes
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error: ', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
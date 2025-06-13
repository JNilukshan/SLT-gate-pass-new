import express from 'express';
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// CSV Upload Route
router.post('/upload', upload.single('csvFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', (row) => {
            if (!row.username || !row.email || !row.password) {
                console.error("Skipping invalid row:", row);
                return; // Skip rows with missing required fields
            }

            results.push({
                username: row.username,
                email: row.email,
                password: row.password, // Will be hashed before saving
                sender_name: row.sender_name || '',
                designation: row.designation || '',
                service_no: row.service_no || '',
                section: row.section || '',
                group_number: row.group_number || '',
                contact_number: row.contact_number || '',
                branch_location: row.branch_location || '',
                role: row.role || 'user', // Default to "user" if not specified
            });
        })
        .on('end', async () => {
            try {
                console.log("Total users to insert:", results.length);

                for (const user of results) {
                    if (!user.password) {
                        console.error("Skipping user due to missing password:", user);
                        continue;
                    }

                    

                    // Check if user already exists
                    const existingUser = await User.findOne({ email: user.email });
                    if (!existingUser) {
                        await User.create(user);
                        console.log("User created:", user.email);
                    } else {
                        console.warn("User already exists, skipping:", user.email);
                    }
                }

                // Delete uploaded file after processing
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Error deleting file:", err);
                });

                res.status(200).json({ message: 'Users uploaded successfully' });
            } catch (error) {
                console.error("Error inserting users:", error);
                res.status(500).json({ message: 'Error inserting users', error: error.message });
            }
        })
        .on('error', (err) => {
            console.error("Error reading CSV file:", err);
            res.status(500).json({ message: 'Error reading CSV file', error: err.message });
        });
});

export default router;

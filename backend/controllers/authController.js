import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// Signup
export const signup = async (req, res) => {
    try {
        const { username, email, password, sender_name, designation, service_no, section, group_number, contact_number ,branch_location,role} = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const user = new User({
            username,
            email,
            password,
            sender_name,
            designation,
            service_no,
            section,
            group_number,
            contact_number,
            branch_location,
            role
        });

        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        // Include branch_location in the token payload
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                branch_location: user.branch_location,
                service_no: user.service_no,
                sender_name: user.sender_name,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token, role: user.role, username: user.username });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Get current logged-in user details
export const getSenderDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserByServiceNumber = async (req, res) => {
    try {
      const { serviceNo } = req.params;
      const user = await User.findOne({ service_no: serviceNo });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Return only necessary fields for receiver
      res.status(200).json({
        sender_name: user.sender_name,
        contact_number: user.contact_number,
        group_number: user.group_number
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
  };
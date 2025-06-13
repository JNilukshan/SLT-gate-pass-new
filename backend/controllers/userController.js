import User from '../models/userModel.js';

export const getUserByServiceNumber = async (req, res) => {
    try {
      const user = await User.findOne({ service_no: req.params.serviceNo });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Return only necessary details
      res.status(200).json({
        _id: user._id,
        sender_name: user.sender_name,
        designation: user.designation,
        service_no: user.service_no,
        section: user.section,
        group_number: user.group_number,
        contact_number: user.contact_number
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error: error.message });
    }
  };

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// UPDATE user by ID
export const updateUserById = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

// DELETE user by ID
export const deleteUserById = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};
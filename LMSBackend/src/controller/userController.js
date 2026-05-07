const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    // Exclude admin accounts from the list
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user.id) {
      return res.status(403).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting other admin accounts
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be deleted' });
    }

    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllUsers, deleteUser, getProfile };

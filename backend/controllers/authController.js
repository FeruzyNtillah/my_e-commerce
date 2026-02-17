const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password // Will be hashed by pre-save middleware
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user (include password this time with +password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // req.user is already set by protect middleware
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        address: user.address,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    // Build only the fields that were actually sent — never overwrite with undefined
    const updateFields = {};

    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.phone) updateFields.phone = req.body.phone;
    if (req.body.avatar) updateFields.avatar = req.body.avatar;

    // Email updates: only allow if a new value is explicitly provided
    // (keeping email disabled in the form is safest — skip it here)
    // if (req.body.email) updateFields.email = req.body.email;

    // Merge address sub-fields if any are provided
    if (req.body.address) {
      // Use dot-notation keys so only sent sub-fields are touched in MongoDB
      const addr = req.body.address;
      if (addr.street) updateFields['address.street'] = addr.street;
      if (addr.city) updateFields['address.city'] = addr.city;
      if (addr.state) updateFields['address.state'] = addr.state;
      if (addr.zipCode) updateFields['address.zipCode'] = addr.zipCode;
      if (addr.country) updateFields['address.country'] = addr.country;
    }

    // findByIdAndUpdate avoids triggering the full Mongoose validation
    // pipeline (password hash hooks, unique index conflicts, etc.)
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        address: updatedUser.address,
        phone: updatedUser.phone
      }
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // --- FIX: Validate inputs before touching the DB ---
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Please provide both current password and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters'
      });
    }

    // --- FIX: Always explicitly select +password here ---
    // req.user from protect middleware does NOT include password field,
    // so we must re-query the user with .select('+password')
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // --- FIX: Guard against missing matchPassword method ---
    if (typeof user.matchPassword !== 'function') {
      console.error('matchPassword method is missing on User model');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Check current password against the hashed one in DB
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Assign new password — pre-save hook will hash it automatically
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully. Please login again.'
    });
  } catch (error) {
    // --- FIX: Log the full error so you can debug future issues ---
    console.error('updatePassword error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
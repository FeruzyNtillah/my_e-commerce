const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'feruzykarim4@gmail.com' });
    
    if (adminExists) {
      console.log('❌ Admin with this email already exists');
      process.exit();
    }

    // Create admin
    const admin = await User.create({
      name: 'Karim Feruzy',
      email: 'feruzykarim4@gmail.com',
      password: 'Admin@123456', // CHANGE THIS IMMEDIATELY!
      role: 'admin'
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: Admin@123456');
    console.log('⚠️  PLEASE CHANGE PASSWORD AFTER FIRST LOGIN!');
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');

const seedAdmin = async () => {
  try {
    await connectDB();

    // Clear existing admins
    await Admin.deleteMany();

    const username = 'admin';
    const password = 'password123';

    await Admin.create({
      username,
      password
    });

    console.log('✅ Default Admin Created:');
    console.log(`👤 Username: ${username}`);
    console.log(`🔑 Password: ${password}`);
    
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();

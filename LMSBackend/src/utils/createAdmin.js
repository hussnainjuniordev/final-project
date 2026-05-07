require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

  
    const adminData = {
      name: 'Admin',
      email: 'admin@lms.com',
      password: 'admin123',
      role: 'admin',
    };

 
    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
      console.log('Admin already exists:', existing.email);
      process.exit(0);
    }

    // Hash password and create admin
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = await User.create({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin created successfully!');
    console.log('   Email   :', admin.email);
    console.log('   Password: admin123');
    console.log('   Role    :', admin.role);
    console.log('\n⚠️  Change the password after first login!');

    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
};

createAdmin();

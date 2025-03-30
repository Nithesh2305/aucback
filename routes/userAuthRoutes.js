const express = require('express');
const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Signup API
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, dob, rollno, college } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { rollno }] });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email or roll number already exists'
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      dob,
      rollno,
      college
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          rollno: newUser.rollno,
          college: newUser.college
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// Signin API
router.post('/signin', async (req, res) => {
  try {
    const { rollno, password } = req.body;

    // 1) Check if rollno and password exist
    if (!rollno || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide roll number and password'
      });
    }

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ rollno }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect roll number or password'
      });
    }

    // 3) Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 4) Send response
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          rollno: user.rollno,
          college: user.college
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

module.exports = router;
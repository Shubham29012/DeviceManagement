const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  }

  async signup(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      const user = new User(userData);
      await user.save();

      console.log(`New user registered: ${user.email}`);
      return { success: true, message: 'User registered successfully' };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      const token = this.generateToken(user._id);
      
      console.log(`User logged in: ${user.email}`);
      return {
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
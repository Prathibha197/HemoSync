const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { sendOTP } = require('../utils/email');

const register = async (req, res) => {
  try {
    const { role, name, email, mobile, password, bloodType, longitude, latitude } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate 6-digit OTP for Registration
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    let user;
    if (longitude && latitude) {
      const result = await prisma.$queryRaw`
        INSERT INTO "User" (id, role, name, email, mobile, password, "bloodType", "updatedAt", location, otp, "otpExpires")
        VALUES (
          gen_random_uuid(), 
          ${role}::"Role", 
          ${name}, 
          ${email}, 
          ${mobile},
          ${hashedPassword}, 
          ${bloodType}, 
          NOW(), 
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
          ${otp},
          ${otpExpires}
        )
        RETURNING id, role, name, email, "bloodType";
      `;
      user = result[0];
    } else {
      user = await prisma.user.create({
        data: {
          role,
          name,
          email,
          mobile,
          password: hashedPassword,
          bloodType,
          otp,
          otpExpires
        },
        select: {
          id: true,
          role: true,
          name: true,
          email: true,
          bloodType: true
        }
      });
    }

    // Fire-and-forget the email so it doesn't block the response
    sendOTP(email, otp).catch(console.error);
    
    // Simulate dispatch
    console.log(`\n==========================================`);
    console.log(`📧 EMAIL SIMULATION: Sent OTP to ${email}: ${otp}`);
    console.log(`📲 SMS SIMULATION: Sent OTP to ${mobile}: ${phoneOtp}`);
    console.log(`==========================================\n`);

    res.status(201).json({ message: 'User registered, verify OTP', pendingVerification: true, email });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    
    // Fallback if they entered it in plain text manually into Supabase
    if (!isMatch && password === user.password) {
      isMatch = true;
      // Re-hash and save to fix the database seamlessly
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpires }
    });

    // Fire-and-forget the email so it doesn't block the login response if SMTP hangs
    sendOTP(user.email, otp).catch(console.error);

    res.json({ message: 'OTP sent to email', pendingVerification: true, email: user.email });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.otp || user.otp !== otp || !user.otpExpires || new Date() > user.otpExpires) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // Clear OTP
    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpires: null }
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'super-secret-key',
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token, user: { id: user.id, role: user.role, name: user.name } });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  verifyOtp
};

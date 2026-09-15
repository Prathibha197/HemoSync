const express = require('express');
const { register, login, verifyOtp } = require('../controllers/authController');
const { authenticate } = require('../utils/authMiddleware');
const prisma = require('../config/db');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/logout', (req, res) => res.json({ success: true }));

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ id: user.id, role: user.role, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

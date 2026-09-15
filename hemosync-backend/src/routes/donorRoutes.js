const express = require('express');
const { getProfile, getAlerts, respondToRequest, getHistory } = require('../controllers/donorController');
const { authenticate } = require('../utils/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.get('/alerts', getAlerts);

// Mock endpoints for the rest of the donor UI to prevent 404s
router.get('/history', getHistory);
router.get('/nearby-banks', (req, res) => res.json([]));
router.post('/alerts/:id/respond', respondToRequest);

module.exports = router;

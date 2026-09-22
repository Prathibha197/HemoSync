const express = require('express');
const { getProfile, getAlerts, respondToRequest, getHistory, getNearbyBanks } = require('../controllers/donorController');
const { authenticate } = require('../utils/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.get('/alerts', getAlerts);
router.get('/history', getHistory);
router.get('/nearby-banks', getNearbyBanks);
router.post('/alerts/:id/respond', respondToRequest);

module.exports = router;

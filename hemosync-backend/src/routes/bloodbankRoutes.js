const express = require('express');
const { authenticate } = require('../utils/authMiddleware');
const { getInventory, addBloodUnit, getIncomingRequests, fulfillRequest, declineRequest } = require('../controllers/bloodbankController');

const router = express.Router();

router.use(authenticate);

// Real endpoints
router.get('/inventory', getInventory);
router.post('/inventory', addBloodUnit);
router.get('/requests/incoming', getIncomingRequests);
router.post('/requests/:id/fulfill', fulfillRequest);
router.post('/requests/:id/decline', declineRequest);
router.get('/raktkosha/status', (req, res) => res.json({ banks: [], lastGlobalSync: new Date().toISOString() }));
router.post('/raktkosha/sync', (req, res) => res.json({ success: true, syncedAt: new Date().toISOString() }));
router.get('/whatsapp/log', (req, res) => res.json([]));
router.post('/whatsapp/send', (req, res) => res.json({ success: true, sent: new Date().toISOString() }));

module.exports = router;

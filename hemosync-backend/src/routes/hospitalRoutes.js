const express = require('express');
const { authenticate } = require('../utils/authMiddleware');
const { getRequests, getInventory } = require('../controllers/hospitalController');

const router = express.Router();

router.use(authenticate);

// Real endpoints
router.get('/requests', getRequests);
router.get('/inventory', getInventory);
router.get('/fhir/status', (req, res) => res.json([]));

module.exports = router;

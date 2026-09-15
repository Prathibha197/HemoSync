const express = require('express');
const { createRequest, updateRequest } = require('../controllers/requestController');
const { authenticate } = require('../utils/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/', createRequest);
router.put('/:id', updateRequest);

module.exports = router;

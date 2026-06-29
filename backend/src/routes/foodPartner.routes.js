const express = require('express');
const foodPartnerController = require('../controller/foodPartner.controller');

const router = express.Router();

// public restaurant profile
router.get('/:id', foodPartnerController.getPartnerProfile);

module.exports = router;

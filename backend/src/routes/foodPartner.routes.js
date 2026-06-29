const express = require('express');
const foodPartnerController = require('../controller/foodPartner.controller');

const router = express.Router();

// list all restaurants (specific route before dynamic :id)
router.get('/', foodPartnerController.listPartners);

// public restaurant profile
router.get('/:id', foodPartnerController.getPartnerProfile);

module.exports = router;

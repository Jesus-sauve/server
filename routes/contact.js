const express = require('express');
const router = express.Router();
const { contactForm } = require('../controllers/contact');

// validators
const { runValidation } = require('../validators');
const { contactFormValidator } = require('../validators/contact');

router.post('/contact', contactFormValidator, runValidation, contactForm);

module.exports = router;
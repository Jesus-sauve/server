const { check } = require('express-validator');

exports.contactFormValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Merci de sasir votre nom'),
    check('email')
        .isEmail()
        .withMessage("L'addresse mail doit être correcte"),
    check('message')
        .not()
        .isEmpty()
        .isLength({ min: 10 })
        .withMessage('Votre message doit contenir au moins 10 caractères')
];
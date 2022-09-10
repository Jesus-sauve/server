const { check } = require('express-validator');

exports.userSignupValidator = [
    check('email')
        .isEmail()
        .withMessage('Adresse mail invalide'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Le password est inférieur à 6 caractères')
];

exports.userSigninValidator = [
    check('email')
        .isEmail()
        .withMessage('Adresse mail invalide'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Le password est inférieur à 6 caractères')
];

exports.forgotPasswordValidator = [
    check('email')
        .not()
        .isEmpty()
        .isEmail()
        .withMessage('Adresse email invalide')
];

exports.resetPasswordValidator = [
    check('newPassword')
        .not()
        .isEmpty()
        .isLength({ min: 6 })
        .withMessage('Le password est inférieur à 6 caractères')
];
const { check } = require('express-validator');

exports.categoryCreateValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Veuillez saisir le nom de la catégorie')
];
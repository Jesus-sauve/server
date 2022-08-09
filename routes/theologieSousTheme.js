const express = require('express');
const router = express.Router();
const { create, list, read, remove,show } = require('../controllers/theologieSousTheme');

router.post('/theologie-sous-theme', create);
router.get('/theologie-sous-themes', list);
router.get('/theologie-sous-theme/:slug', read);
router.get('/theologie-sous-theme-actuel/:slug', show);
router.delete('/theologie-sous-theme/:slug', remove);

module.exports = router;


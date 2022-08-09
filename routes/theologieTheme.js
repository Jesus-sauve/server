const express = require('express');
const router = express.Router();
const { create, list, read, remove, show } = require('../controllers/theologieTheme');

router.post('/theologie-theme', create);
router.get('/theologie-themes', list);
router.get('/theologie-theme/:slug', read);
router.get('/theologie-theme-actuel/:slug', show);
router.delete('/theologie-theme/:slug', remove);

module.exports = router;


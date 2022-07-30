const express = require('express');
const router = express.Router();
const { create, list, remove } = require('../controllers/bilble-en-ligne');

router.post('/bible-en-ligne', create);
router.get('/bible-en-ligne', list);
router.delete('/bible-en-ligne/:slug', remove);

module.exports = router;


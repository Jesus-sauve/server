const express = require('express');
const router = express.Router();
const { create, list, update, show } = require('../controllers/presentation');

router.post('/presentation', create);
router.get('/presentation', list);
router.get('/presentation/:slug', show);
router.put('/presentation/:slug', update);

module.exports = router;
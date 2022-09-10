const express = require('express');
const router = express.Router();
const { create, list, update, show, remove } = require('../controllers/presentation');

router.post('/presentation', create);
router.get('/presentation', list);
router.get('/presentation/:slug', show);
router.put('/presentation/:slug', update);
router.delete('/presentation/:slug', remove);

module.exports = router;
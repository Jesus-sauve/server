const express = require('express');
const router = express.Router();
const { create, listTheologie, list, read, remove, update } = require('../controllers/theologie');

router.post('/theologie', create);
router.get('/theologies', list);
router.post('/theologies', listTheologie);
router.get('/theologie/:slug', read);
router.delete('/theologie/:slug', remove);
router.put('/theologie/:slug', update);

module.exports = router;


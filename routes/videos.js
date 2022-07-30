const express = require('express');
const router = express.Router();
const { create, listVideos, listSearch, list, read, remove, update } = require('../controllers/videos');

router.post('/video', create);
router.get('/videos', list);
router.post('/videos', listVideos);
router.get('/video/:slug', read);
router.delete('/video/:slug', remove);
router.put('/video/:slug', update);
router.get('/video/recherche', listSearch);

module.exports = router;
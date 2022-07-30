const express = require('express');
const router = express.Router();
const { create, listAllEnseignementCategories, listRelated, listSearch, list, read, remove, update, photo } = require('../controllers/enseignement');

router.post('/enseignement', create);
router.get('/enseignements', list);
router.post('/enseignements-categories', listAllEnseignementCategories);
router.get('/enseignement/:slug', read);
router.delete('/enseignement/:slug', remove);
router.put('/enseignement/:slug', update);
router.get('/enseignement/photo/:slug', photo);
router.post('/enseignements/related', listRelated);
router.get('/enseignements/recherche', listSearch);

module.exports = router;
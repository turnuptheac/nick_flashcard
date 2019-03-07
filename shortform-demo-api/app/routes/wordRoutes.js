const express = require('express');
const router = express.Router();
const WordCtrl = require('../controllers/WordCtrl');

router.param('wordId', WordCtrl.getWordById);

router.route('/:wordId')
    .get(WordCtrl.respondWordById)
    .put(WordCtrl.updateWord)
    .delete(WordCtrl.deleteWord);

router.route('/')
    .post(WordCtrl.createWord)
    .get(WordCtrl.getAllWords);

module.exports = router;

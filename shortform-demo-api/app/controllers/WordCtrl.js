const _ = require('lodash');
const config = require('../../config/config');
const Word = require('../models/Word');
const moment = require('moment');

exports.getWordById = function(req, res, next) {
    Word.findOne({_id: req.params.wordId}).exec()
        .then(word => {
            if (!word) {
                return res.json({success: false, msg: 'Could not find word.', err: req.params.wordId});
            }
            req.word = word;
            next();
        })
        .catch(err => res.json({success: false, msg: 'Missing word id.', err}));
};

exports.respondWordById = function(req, res) {
    return res.json({success: true, word: req.word});
};

exports.createWord = function(req, res) {
    let newWord = new Word(req.body);
    newWord.save()
        .then(word => {
            return res.json({success: true, word });
        })
        .catch(err => res.status(400).json({success: false, msg: 'Could not create new word.', err }));
};

exports.updateWord = function(req, res) {
    for (let prop in req.body) {
        req.word[prop] = req.body[prop];
    }

    req.word.save()
        .then(updatedWord => res.json({success: true, word: updatedWord}))
        .catch(err => res.status(400).json({success: false, msg: 'Error occurred in updating word.', err }));
};

exports.deleteWord = function(req, res) {
    req.word.remove()
        .then(() => res.json({success: true}))
        .catch(err => res.status(400).json({success: false, msg: 'Unable to delete word.', err }));
};

exports.getAllWords = function(req, res) {
    let query = {};
    let select;
    if (req.query.select) {
        select = req.query.select.replace(/,/g, ' ');
        delete req.query.select;
    }
    for (let prop in req.query) {
        if (req.query[prop]) {
            if (prop === 'numCorrect' || prop === 'numWrong' || prop === 'currentBin') {
                query[prop] = parseInt(req.query[prop]);
            } else {
                query[prop] = new RegExp(req.query[prop], 'i');
            }
        }
    }

    Word.find(query).select(select).exec()
        .then(words => res.json({success: true, words }))
        .catch(err => res.json({success: false, msg: 'Could not retrieve words.', err }));
};

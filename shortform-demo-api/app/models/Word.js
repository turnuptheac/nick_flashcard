const config = require('../../config/config');
const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    definition: {
        type: String,
        required: true
    },
    numCorrect: {
        type: Number,
        default: 0
    },
    numWrong: {
        type: Number,
        default: 0
    },
    currentBin: {
        type: Number,
        default: 0
    },
    nextReviewDate: {
        type: Date,
        default: () => moment().format()
    }
});

module.exports = mongoose.model('Word', schema);

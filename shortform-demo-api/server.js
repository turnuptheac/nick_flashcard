require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/config');
// const port = process.env.PORT || 8080;
const port = 8555;
const moment = require('moment');

console.log('NODE_ENV: ', process.env.NODE_ENV);

app.disable('x-powered-by');

app.config = config;

if (process.env.NODE_ENV === 'production') {
    app.use(cors({
        // origin: [/.*zenimus\.com$/],
        origin: true,
        credentials: true
    }));
} else {
    app.use(cors({
        origin: true,
        credentials: true
    }));
}

app.use(compression());

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// log to console
app.use(morgan('dev'));

// connect to database
mongoose.connect(config.database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
app.db = mongoose.connection;
app.db.on('error', console.error.bind(console, 'connection error:'));
app.db.once('open', function() {
    console.log('Db connected.');
});

var router = require('./app/routes/index.js');
app.use(router);

app.use('/.well-known', express.static(process.cwd() + '/public/.well-known'));
app.use('/public', express.static(process.cwd() + '/public'));

// catch all
app.use((err, req, res, next) => {
    // For custom authMiddleware
    if (err === 'Unauthorized') {
        return res.status(401).send('Unauthorized');
    }

    console.log('err: ', err);

    var subject = 'PocketDoc Node ERROR: 422 Code';
    var message = {
        date: (new Date()).toUTCString(),
        name: err.name,
        code: err.code,
        message: err.message,
        data: err.data,
        stack: err.stack
    };

    if (process.env.NODE_ENV === 'production') {
        EmailCtrl.logEvent(subject, message, function(err) {
        });
    }

    res.status(422).send({ error: err.message, msg: err.msg });
});

var server = app.listen(port, function() {
    console.log('Node.js listening on port ' + port + '...');
});



const express = require('express');
const router = express.Router();
const wordRoutes = require('./wordRoutes');

router.use('/api/word', wordRoutes);

const path = process.cwd();
router.get('/', function(req, res) {
    res.sendFile(path + '/public/index.html');
});

module.exports = router;

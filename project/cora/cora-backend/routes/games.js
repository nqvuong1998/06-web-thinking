const express = require('express');
const router = express.Router();
const gameController = require('../controllers/games');

router.get('/history', gameController.getHistory);

module.exports = router;
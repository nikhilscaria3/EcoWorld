// routes/birdRoutes.js

const express = require('express');
const router = express.Router();
const birdController = require('../controllers/birdcontroller');

// Route for getting all birds
router.get('/api/data', birdController.getAllBirds);

router.get('/api/getimages', birdController.getImage);

module.exports = router;

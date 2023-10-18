
const express = require('express');
const router = express.Router();
const birdcontroller = require('../controllers/birdaddcontroller');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/api/dataadd', upload.array('file', 10), birdcontroller.createAddBird);

module.exports = router;

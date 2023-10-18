const express = require('express')
const router = express.Router()
const animalcontroller = require('../controllers/animaladdcontroller')
const multer = require('multer');

const upload = multer({ dest: './uploads1/' });


router.get('/', animalcontroller.getAdd)

router.post('/', upload.single('photo'),animalcontroller.createAdd)

module.exports = router
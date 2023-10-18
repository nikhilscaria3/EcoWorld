const express = require('express')
const router = express.Router()
const animalcontroller = require('../controllers/animalcontroller')
const multer = require('multer');

const upload = multer({ dest: './uploads1/' });


router.get('/', animalcontroller.getAllAnimals)

router.post('/', upload.single('photo'), animalcontroller.createAllAnimals)

module.exports = router
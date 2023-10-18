// controllers/birdController.js

const { Data } = require('../models/usermodel');

exports.getAllBirds = async (req, res) => {
  try {

    const category = req.query

    const users = await Data.find({ category: category.category });

    // Extract image details from the nested structure
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getImage = async (req, res) => {
  try {
    const { species, name , category} = req.query;
    console.log(category);

    // Check if required parameters are provided
    if (!species || !name) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    // Query the database based on species and name
    const users = await Data.find({ category: category, name });

    // Check if the user is found
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract image details from the nested structure and send the response
    const imageUrls = users[0].photos.map((photo) => photo.imageUrl);
    res.json({ imageUrls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

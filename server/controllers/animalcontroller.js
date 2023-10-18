
const { User } = require('../models/usermodel');


exports.getAllAnimals = async (req, res) => {
    try {
        const animals = await User.find({category:"animals"});
    
        // Extract image details from the nested structure
        const birdsWithImages = animals.map(bird => {
          const { _id, name, description, summary, species, photo } = bird;
          const { title, filepath } = photo;
          return { _id, name, description, summary, species, title, filepath };
        });
    
        res.render('animal', { animals: birdsWithImages });
      } catch (err) {
        console.error(err);
        res.render('error');
      }
    };

exports.createAllAnimals = async (req, res) => {
    const { name, description, summary, species } = req.body;
    const { originalname, filename } = req.file;
  
    const user = new User({
      name,
      description,
      summary,
      species,
      photo: {
        title: originalname,
        filepath: filename
      }
    });
  
    try {
      await user.save();
      res.redirect('/animaladd');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  };

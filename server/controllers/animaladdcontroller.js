const { animal } = require('../models/usermodel');



exports.getAdd = async (req, res) => {
    res.render('animaladd')
}


exports.createAdd = async (req, res) => {
    const { name, description, summary, species } = req.body;
    const { originalname, filename } = req.file;
  
    const user = new animal({
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

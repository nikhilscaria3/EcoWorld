const mongoose = require('mongoose')
const { User, animal } = require('./models/usermodel');
const express = require("express")
const app = express()
const path = require('path')
const bodyParser = require('body-parser');
const hbs = require('hbs')
const cors = require("cors")
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, "../server/config/config.env") });
const multer = require('multer');
const fs = require('fs');

app.use(bodyParser.json());

  app.use(cors({

    origin: ["https://eco-world-eta.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true

  }
  ))


app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'routes')]);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


  mongoose.connect(process.env.DB_LOCAL_URI)
    .then(() => {
      console.log("Connected to Cloud MongoDB");

    })
    .catch(() => {
      console.log("Error connecting to MongoDB");
    });


  app.listen(5000, () => {
    console.log('Server listening on port 5000 Cloud');
  });





// Configure Multer





const birdRoutes = require('./routes/birdroute');
const birdAddRoutes = require('./routes/birdaddroute');

// // Other app configurations and middleware

// // Mount the bird routes
app.use('/', birdRoutes);
app.use('/', birdAddRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// app.post('/birdsadd', upload.single('photo'), async (req, res) => {
//   const { name, description, summary, species } = req.body;
//   const { originalname, filename } = req.file;

//   const user = new User({
//     name,
//     description,
//     summary,
//     species,
//     photo: {
//       title: originalname,
//       filepath: filename
//     }
//   });

//   try {
//     await user.save();
//     res.status(200).send('User and Image uploaded successfully');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

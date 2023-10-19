const mongoose = require('mongoose')

// const addressSchema = new mongoose.Schema({
//     city: String,
//     street: String
// })

const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
  },
});

const DataSchema = new mongoose.Schema({
  name: String,
  description: String,
  summary: String,
  species: String,
  category: String,
  photos: {
    type: [imageSchema],
  },
});



const CategorySchema = new mongoose.Schema({
  category: String
})
const Data = mongoose.model('datas', DataSchema);
const Category = mongoose.model('category', CategorySchema);


//   const animalSchema = new mongoose.Schema({
//     name: String,
//     description:String,
//     summary:String,
//     species:String,
//     photo:{
//       title: String,
//       filepath: String
//     }

//   });

//   const animal = mongoose.model('animals', animalSchema);

module.exports = {
  Data,
  Category
}



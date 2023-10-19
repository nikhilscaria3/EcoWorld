const { Data, Category } = require('../models/usermodel');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

exports.createAddBird = async (req, res) => {
  const { name, description, summary, category, species, data } = req.body;
  const files = req.files; // Array of files from multi-part form data
  console.log(req.body);

  const existingCategory = await Category.findOne({ category });

  if (!existingCategory) {
    const newCategory = new Category({
      category
    });
  
    await newCategory.save();
    console.log('Category added successfully.');
  } else {
    console.log('Category already exists.');
  }
  
  // Check if there are files in the request
  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const uploadedImages = [];

  // Iterate through the array of files and upload them to S3
  for (const file of files) {
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({ message: 'Invalid image file type' });
    }

    const params = {
      Bucket: 'careerleap', // Replace with your S3 bucket name
      Key: file.originalname, // Prefix the file name with userId or other unique identifier if needed
      Body: file.buffer,
    };

    const command = new PutObjectCommand(params);

    try {
      await s3Client.send(command);
      const imageUrl = `https://careerleap.s3.eu-north-1.amazonaws.com/${file.originalname}`;
      uploadedImages.push({ imageUrl });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to upload image' });
    }
  }

  // Create a new User instance with uploaded images and other data
  const user = new Data({
    name,
    description,
    summary,
    species,
    category,
    photos: uploadedImages,
  });

  try {
    await user.save();
    res.status(200).json({ message: 'User and Images uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();  // Assuming you have installed dotenv: npm install dotenv

const app = express();
const port = process.env.PORT || 3001; // Use port from environment variable or fallback to 3001

MONGO_URI="mongodb://localhost:27017/project"

// Load environment variables
const dbURI = process.env.MONGO_URI; // Ensure you have MONGO_URI in your .env file

// MongoDB connection
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const DataSchema = new mongoose.Schema({ content: String });
const Data = mongoose.model('Data', DataSchema);

// Middleware
app.use(cors()); // Use CORS to allow cross-origin requests
app.use(express.json()); // Built-in middleware for parsing JSON
app.use(bodyParser.json()); // Body-parser is deprecated for express.json() but shown here if needed for other types

// Add data endpoint
app.post('/add', async (req, res) => {
  const newData = new Data({ content: req.body.content });
  try {
    const savedData = await newData.save();
    res.status(201).send(savedData);
  } catch (error) {
    console.error('Failed to add data:', error);
    res.status(400).send({ message: 'Failed to add data', error: error.message });
  }
});

// Update data endpoint
app.post('/update', async (req, res) => {
    const { searchContent, newContent } = req.body;
  
    try {
      const updatedData = await Data.findOneAndUpdate(
        { content: searchContent }, // find a document by content
        { content: newContent }, // update the content
        { new: true } // return the updated document
      );
  
      if (!updatedData) {
        console.log('No data found with the given content:', searchContent);
        return res.status(404).send({ message: "No data found with the given content." });
      }
  
      res.send(updatedData);
    } catch (error) {
      console.error('Failed to update data:', error);
      res.status(500).send({ message: 'Failed to update data', error: error.message });
    }
  });


  app.get('/search', async (req, res) => {
    const { query } = req.query;  // Access the query parameter from the URL
  
    try {
      const results = await Data.find({
        content: { $regex: new RegExp(query, 'i') }  // Case-insensitive regex search
      });
  
      if (results.length > 0) {
        res.send(results);
      } else {
        res.send({ message: 'No results found' });
      }
    } catch (error) {
      console.error('Failed to search data:', error);
      res.status(500).send({ message: 'Failed to search data', error: error.message });
    }
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

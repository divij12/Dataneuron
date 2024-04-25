const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/project', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Data schema and model
const DataSchema = new mongoose.Schema({ content: String });
const Data = mongoose.model('Data', DataSchema);

app.use(bodyParser.json());

// Add data endpoint
app.post('/add', async (req, res) => {
    // Create a new instance of the Data model, ensuring that only the 'content' field is used from the request body
    const newData = new Data({ content: req.body.content });
  
    try {
      // Attempt to save the new data to the database
      const savedData = await newData.save();
  
      // If successful, send a 201 status code with the saved data
      res.status(201).send(savedData);
    } catch (error) {
      // Log the error to the server console for debugging
      console.error('Failed to add data:', error);
  
      // Send a 400 status code with the error message
      res.status(400).send({ message: 'Failed to add data', error: error.message });
    }
  });
  

// Update data endpoint
app.post('/update', async (req, res) => {
  try {
    const updatedData = await Data.findByIdAndUpdate(req.body.id, { content: req.body.content }, { new: true });
    if (!updatedData) {
      return res.status(404).send();
    }
    res.send(updatedData);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

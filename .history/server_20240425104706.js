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
  const newData = new Data({ content: req.body.content });
  try {
    const savedData = await newData.save();
    res.status(201).send(savedData);
  } catch (error) {
    res.status(400).send(error);
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

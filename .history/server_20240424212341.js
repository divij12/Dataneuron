const express = require('express');
const bodyParser = require('body-parser');
const { Data, OperationCount } = require('./db'); // Import models

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Root route to test if the server is working
app.get('/', (req, res) => {
  res.send('Server is running. Access the APIs at /add, /update, and /count.');
});

// API to add data
app.post('/add', async (req, res) => {
  try {
    const newData = new Data({ content: req.body });
    await newData.save();
    await OperationCount.updateOne({}, { $inc: { add: 1 } }, { upsert: true });
    res.send({ message: 'Data added successfully', data: newData });
  } catch (error) {
    console.error('Failed to add data:', error);
    res.status(500).send('Error adding data');
  }
});

// API to update data
app.post('/update', async (req, res) => {
  try {
    const updatedData = await Data.findByIdAndUpdate(req.body.id, { content: req.body }, { new: true });
    await OperationCount.updateOne({}, { $inc: { update: 1 } }, { upsert: true });
    res.send({ message: 'Data updated successfully', data: updatedData });
  } catch (error) {
    console.error('Failed to update data:', error);
    res.status(500).send('Error updating data');
  }
});

// API to count operations
app.get('/count', async (req, res) => {
  try {
    const counts = await OperationCount.findOne({});
    res.send({ operationsCount: counts });
  } catch (error) {
    console.error('Failed to retrieve operation counts:', error);
    res.status(500).send('Error retrieving counts');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

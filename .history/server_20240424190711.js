const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.use(bodyParser.json());

let data = {}; // This will store our component data
let operationsCount = { add: 0, update: 0 };

// Root route to test if the server is working
app.get('/', (req, res) => {
  res.send('Server is running. Access the APIs at /add, /update, and /count.');
});

// API to add data
app.post('/add', (req, res) => {
  data = { ...req.body };
  operationsCount.add++;
  res.send({ message: 'Data added successfully', data });
});

// API to update data
app.post('/update', (req, res) => {
  data = { ...data, ...req.body };
  operationsCount.update++;
  res.send({ message: 'Data updated successfully', data });
});

// API to count operations
app.get('/count', (req, res) => {
  res.send({ operationsCount });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

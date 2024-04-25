const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const User = require("./model/dataSchema.js"); <- my schema file

app.use(express.json());
app.use(cors());


// DB config
const db = require('./config/keys').MongoURI; <- my password
mongoose.set('strictQuery', true);


// connect to mongo 
mongoose.connect(db, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(() => 
    console.log('MongoDB Connected'))
  .catch( error => 
    console.log(error)
  );

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
    const { id, content } = req.body;  // Destructure id and content for clearer access
  
    if (!id || content === undefined) {
      // If id or content is missing, return a 400 Bad Request response
      return res.status(400).send({ message: "Missing id or content in the request body." });
    }
  
    try {
      // Attempt to find and update the document with the given id
      const updatedData = await Data.findByIdAndUpdate(id, { content }, { new: true });
  
      if (!updatedData) {
        // If no document was found or updated, return a 404 Not Found response
        return res.status(404).send({ message: "No data found with the given id." });
      }
  
      // If successful, send back the updated document
      res.send(updatedData);
    } catch (error) {
      // Log the error and send a 500 Internal Server Error response
      console.error('Failed to update data:', error);
      res.status(500).send({ message: 'Failed to update data', error: error.message });
    }
  });
  

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

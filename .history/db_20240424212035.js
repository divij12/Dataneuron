const mongoose = require('mongoose');

// Connection URI
const dbURI = 'mongodb://localhost:27017/mydatabase';

// Establish connection
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.log('MongoDB connection error:', err));

// Define a schema
const dataSchema = new mongoose.Schema({
  content: String
});

// Create a model
const Data = mongoose.model('Data', dataSchema);

// Export the model
module.exports = Data;

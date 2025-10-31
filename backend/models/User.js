// backend/models/User.js
const mongoose = require('mongoose');

// Create a schema — this defines the structure of a User document
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Create the model from the schema
const User = mongoose.model('User', userSchema);

// Export the model so you can use it in other files
module.exports = User;

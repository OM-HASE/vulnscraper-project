const mongoose = require('mongoose');

// Create a schema — defines the structure of a User document
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Password optional to allow other auth methods
  phone: { type: String, unique: true, sparse: true }, // phone number optional, must be unique if present
  smsVerified: { type: Boolean, default: false } // flag if SMS number verified
});

// Create the model from the schema
const User = mongoose.model('User', userSchema);

// Export the model for use in other files
module.exports = User;

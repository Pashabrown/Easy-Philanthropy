// Import Schema and Model

const mongoose = require('mongoose');
//a short version of importing the mongoose object to the models and schema
const { Schema, model } = require("../db/connection.js")

// The Schema
const Nonprofit = new Schema({
  url : {type:String},
  theme: String,
  name: String,
  description: String,
  iHaveDonated: Boolean
})

// The User Schema- embedded schema inside of a user schema
const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    // The goals property defined as an array of objects that match the Goal schema
    nonprofits: [Nonprofit],
  },
  { timestamps: true }
)

// The User Model
const User = model("User", UserSchema)

// Export the User Model
module.exports = User


//I cant expoor the image and the User on the same file!!! NEED help
// module.exports = new mongoose.model('Image', Image);
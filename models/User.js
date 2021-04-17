// Import Schema and Model

const mongoose = require('mongoose');
const { Schema, model } = require("../db/connection.js")

// The Goal Schema-defined a goal schema 
const Image = new Schema({
  url : {type:String},
  iHaveDonated: Boolean
})

// The User Schema- embedded a goal schema inside of a user schema
const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    // The goals property defined as an array of objects that match the Goal schema
    images: [Image],
  },
  { timestamps: true }
)

// The User Model
const User = model("User", UserSchema)

// Export the User Model
module.exports = User


//I cant expoor the image and the User on the same file!!! NEED help
// module.exports = new mongoose.model('Image', Image);
// Import Schema and Model
const { Schema, model } = require("../db/connections.js")

// The Goal Schema-defined a Nonprofit schema 
const Nonprofit = new Schema({
  id: String,
  name: String,
  iHaveDonated: Boolean,
})

// const Nonprofit = mongoose.model("Nonprofit", nonprofitSchema);

// The User Schema- embedded a goal schema inside of a user schema
const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    // The nonprofits property defined as an array of objects that match the Goal schema
    nonprofits: [Nonprofit],
  },
  { timestamps: true }
)

// The User Model
const User = model("User", UserSchema)

// Export the User Model
module.exports = User
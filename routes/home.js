///////////////////////////////
// Import Router
////////////////////////////////
//whatever is in package.json we have to match in the routes folder
const router = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")

///////////////////////////////
// Custom Middleware Functions
////////////////////////////////

//This is all authorization 
// Middleware to check if userId is in sessions and create req.session.userId that was made by user._id
const addUserToRequest = async (req, res, next) => {
  if (req.session.userId) {
      //this will find the user object and save it 
    req.user = await User.findById(req.session.userId)
    next()
  } else {
    next()
  }
}

//check if req.user exists, if not redirect to login
const isAuthorized = (req, res, next) => {
    if (req.user){
        next()
    } else {
        res.redirect("/auth/login")
    }
}

///////////////////////////////
// Router Specific Middleware
////////////////////////////////
router.use(addUserToRequest)


///////////////////////////////
// Router Routes
////////////////////////////////
router.get("/", (req, res) => {
    res.render("home")
})

// This is all Authentication

//SIGNUP ROUTES
router.get("/auth/signup", (req, res) => {
  res.render("auth/signup")
})

router.post("/auth/signup", async (req, res) => {
  try {
    // generate salt for hashing
    const salt = await bcrypt.genSalt(10)
    // hash the password
    req.body.password = await bcrypt.hash(req.body.password, salt)
    // console.log(req.body)
    // Create the User
    await User.create(req.body)
    // Redirect to login page
    res.redirect("/auth/login")
  } catch (error) {
    res.json(error)
  }
})

//Login Routes
router.get("/auth/login", (req, res) => {
    res.render("auth/login")
} )

router.post("/auth/login", async (req, res) => {
    //everything is inside the try block
  try {
    //check if the user exists (make sure to use findOne not find)
    const user = await User.findOne({ username: req.body.username })
    if (user) {
      // check if password matches and the variable is a truthy
      const result = await bcrypt.compare(req.body.password, user.password)
      if (result) {
          //add user ID property to the session object
        // create user session property
        req.session.userId = user._id
        //redirect to /goals
        res.redirect("/images")
      } else {
        // send error is password doesn't match
        res.json({ error: "passwords don't match" })
      }
    } else {
      // send error if user doesn't exist
      res.json({ error: "User does not exist" })
    }
  } catch (error) {
    res.json(error)
  }
})

//Logout Route
router.get("/auth/logout", (req, res) => {
  // remove the userId property from the session
  req.session.userId = null
  // redirect back to the main page
  res.redirect("/")
})

//This is all AUTHORIZATION
//index
router.get("/images", isAuthorized, async (req, res) => {
    // pass req.user to our template = that is the goals page!
    res.render("images", {
        images: req.user.images
    })
})

// NEW
router.get("/images/new", isAuthorized, async (req, res) => {
  res.render("new");
});

// // DELETE
// router.delete("/images/:id", isAuthorized, async (req, res) => {
//   Image.findByIdAndDelete(req.params.id, (error, data) => {
//     res.redirect("/images");
//   });
// });

router.put('/images/:id', (req, res) => {
  if (req.body.iHaveDonated === "on"){
    req.body.iHaveDonated = true;
  } else {
    req.body.iHaveDonated = false;
  }
  Image.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, updatedModel)=>{
    res.redirect("/images");
  })
}
)

//create
//goals create route when form submitted
router.post("/images", isAuthorized, async (req, res) => {
  try{
    // fetch up to date user
    const user = await User.findById(req.session.userId)
    // push the goal into the user within the Schema
    user.images.push(req.body)
    await user.save()
    // redirect back to goals
    res.redirect("/images") }
    catch(error){
      console.log(error)
    }
})

//res.send is a test to make sure it works
///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router
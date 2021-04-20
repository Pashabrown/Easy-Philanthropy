///////////////////////////////
// Import Router
////////////////////////////////
//whatever is in package.json we have to match in the routes folder
const router = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const Nonprofit = require("../models/User")

//const auth = require("") <-- do I need this???
//router.use(auth)<-- do I need this too?

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
  //its gonna look for a new folder called auth with a new file called signup
  res.render("auth/signup")
})

router.post("/auth/signup", async (req, res) => {
  //wrap it all in a try catch block-to trigger errors if they occur
  try {
    // generate salt for hashing
    const salt = await bcrypt.genSalt(10)
    // hash the password
    //turns password in to a encrypted password
    req.body.password = await bcrypt.hash(req.body.password, salt)
    // console.log(req.body)
    // Create the User
    await User.create(req.body)
    // Redirect the user to login page
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
      // check if password matches and the variable is a truthy or falsey
      const result = await bcrypt.compare(req.body.password, user.password)
      if (result) {
          //add user ID property to the session object
        // create user session property
        req.session.userId = user._id
        //redirect to /goals
        res.redirect("/nonprofits")
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
  // redirect back to the main page or maybe a dashboard-you would 
  //need to create a route if you make a dashboard
  res.redirect("/")
  //example of router for dashboard- you need to build one in ejs as well
  //router.get("/dashboard", (req, res => {
  //res.render("dashboard")
  //}))
})

//This is all AUTHORIZATION
//index
router.get("/nonprofits", (req, res) => {
    // pass req.user to our template = that is the goals page!
    res.render("nonprofits", {
        nonprofits: req.user.nonprofits
    })
})

// NEW
router.get("/nonprofits/new", isAuthorized, (req, res) => {
  res.render("new");
});

// DELETE
router.delete("/nonprofits/:id", isAuthorized, async(req, res) => {
  const id = req.params.id
  const user = req.user
  const index = user.nonprofits.findIndex((nonprofit) => {
    return id === `${nonprofit._id}`
  })
  user.nonprofits.splice(index, 1)
  await user.save()
  res.redirect("/nonprofits")
});
//i need to render the nonprofit object in to the edit page
router.get('/nonprofits/:id', isAuthorized, (req, res) => {
  const id = req.params.id
  const nonprofit = Nonprofit.findById(id)
  res.render("edit", {nonprofit});
});
//update

// router.put("/:id", isAuthorized, async (req, res) => {
//     const user = await User.findOne({ username: req.user.username })
//     const id = req.params.id
//     const index = req.user.nonprofits.findIndex((nonprofit) => `${nonprofit._id}` === id)
//     req.user.blogs[index].title = req.body.title
//     req.user.blogs[index].body = req.body.body
//     req.user.save()
//     res.redirect(`/nonprofits/${id}`)
// })


router.put('/nonprofits/:id', isAuthorized, async(req, res) => {
  if (req.body.iHaveDonated === "on"){
    req.body.iHaveDonated = true;
  } else {
    req.body.iHaveDonated = false;
  }
  // const id = req.params.id
  // await Nonprofit.findByIdAndUpdate(id, req.body, { new: true});
  const user = req.user
  const index = req.user.nonprofits.findIndex((nonprofit) => {
    return id === `${nonprofit.id}`
  })
  user.nonprofits[index].url = req.body.url
  user.nonprofits[index].theme = req.body.theme
  user.nonprofits[index].name = req.body.name
  user.nonprofits[index].description = req.body.description
  user.nonprofits[index].iHaveDonated = req.body.iHaveDonated
  await user.save()
  res.redirect("/nonprofits")
}
)

//create
//nonprofits create route when form submitted
router.post("/nonprofits", async (req, res) => {
    if (req.body.iHaveDonated === "on"){
        req.body.iHaveDonated = true;
    } else {
        req.body.iHaveDonated = false;
    }
    // fetch up to date user
    const user = await User.findById(req.session.userId)
    // push the goal into the user within the Schema
    user.nonprofits.push(req.body)
    await user.save()
    // redirect back to goals
    res.redirect("/nonprofits") 
   
})
//show
// router.get("/:id", async (req, res) => {
//   const id = req.params.id;
//   const index = req.user.nonprofits.findIndex((nonprofit) => `${nonprofit._id}` === id);
//   const nonprofit = req.user.nonprofits[index];
//   console.log(nonprofit);
//   res.render("nonprofits/show", {
//     nonprofit,
//   });
// });

//res.send is a test to make sure it works
///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router
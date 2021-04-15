// grab environment variables
require("dotenv").config();
// IMPORT EXPRESS
const express = require("express");
// IMPORT DATABASE CONNECTION
const mongoose = require("./db/connections");
// IMPORT MERCED LOGGER
const { log } = require("mercedlogger");
//IMPORT MIDDLEWARE
const methodOverride = require("method-override");
const morgan = require("morgan");
const cors = require("cors");
// GET PORT FROM ENV OR DEFAULT PORT
const PORT = process.env.PORT || "2021";
const SECRET = process.env.SECRET || "secret"
const HomeRouter = require("./routes/index.js");
// Sessions Middleware
const session = require("express-session"); // create session cookies
const connect = require("connect-mongodb-session")(session) // store cookies in mongo
const Users = require("./models/User.js");
const Nonprofit = require("./models/User.js");
/////////////////////////////////////
// Create Express Application Object
/////////////////////////////////////

const app = express();

/////////////////////////////////////
// Set the View Engine
/////////////////////////////////////
app.set("view engine", "ejs");

/////////////////////////////////////
// Setup Middleware
/////////////////////////////////////
app.use(cors()); // Prevent Cors Errors if building an API
app.use(methodOverride("_method")); // Swap method of requests with _method query
app.use(express.static("public")); // serve the public folder as static
app.use(morgan("tiny")); // Request Logging
app.use(express.json()); // Parse json bodies
app.use(express.urlencoded({ extended: false })); //parse bodies from form submissions
// SESSION MIDDLEWARE REGISTRATION (adds req.session property)
app.use(
  session({
    secret: SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    saveUninitialized: true, // create session regardless of changes
    resave: true, //save regardless of changes
    store: new connect({
      uri: process.env.MONGODB_URL,
      databaseName: "sessions",
      collection: "sessions",
    }),
  })
);

/////////////////////////////////////
// Routes and Routers
/////////////////////////////////////

//HomeRouter
app.use("/", HomeRouter);

// INDEX
app.get("/nonprofits", (req, res) => {
  Nonprofit.find({}, (error, allNonprofits) => {
    res.render("index", {
      nonprofits: allNonprofits,
    });
  });
});

// NEW
app.get("/nonprofits/new", (req, res) => {
  res.render("new");
});

// DELETE
app.delete("/nonprofits/:id", (req, res) => {
  Nonprofit.findByIdAndDelete(req.params.id, (error, data) => {
    res.redirect("/nonprofits");
  });
});

// UPDATE
app.put('/nonprofits/:id', (req, res) => {
  if (req.body.iHaveDonated === "on"){
    req.body.iHaveDonated = true;
  } else {
    req.body.iHaveDonated = false;
  }
  Nonprofit.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, updatedModel)=>{
    res.redirect("/nonprofits");
  })
}
)

// CREATE
app.post("/nonprofits", (req, res) => {
  if (req.body.readyToEat === "on") {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false;
  }

  Nonprofit.create(req.body, (error, createdNonprofit) => {
    console.log(createdNonprofit);
    res.redirect("/nonprofits");
  });
});

// EDIT
app.get("/nonprofits/:id/edit", (req, res) => {
  Nonprofit.findById(req.params.id, (error, foundNonprofit) => {
    res.render("edit.ejs", {
      Nonprofit: foundNonprofit,
    });
  });
});

// SHOW

app.get("/nonprofits/:id", (req, res) => {
  Nonprofit.findById(req.params.id, (error, foundNonprofit) => {
    res.render("show", { fruit: foundNonprofit });
  });
});


/////////////////////////////////////
// App Listener
/////////////////////////////////////
app.listen(PORT, () =>
  log.white("🚀 Server Launch 🚀", `Listening on Port ${PORT}`)
);

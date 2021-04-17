// grab environment variables
require("dotenv").config();
const fs = require('fs');
const path = require('path');
// IMPORT EXPRESS
const express = require("express");
// IMPORT DATABASE CONNECTION
const mongoose = require("./db/connection");
// IMPORT MERCED LOGGER
const { log } = require("mercedlogger");
//IMPORT MIDDLEWARE
const methodOverride = require("method-override");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require('body-parser');
// GET PORT FROM ENV OR DEFAULT PORT
const PORT = process.env.PORT || "2021";
const SECRET = process.env.SECRET || "secret"
const HomeRouter = require("./routes/home.js");
// Sessions Middleware
const session = require("express-session"); // create session cookies
const connect = require("connect-mongodb-session")(session) // store cookies in mongo


///Set up multer for storage of uploads 
// const multer = require('multer');
 
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });
 
// const upload = multer({ storage: storage });

// const imgModel = require('./models/User');
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

// app.get('/', (req, res) => {
//     imgModel.find({}, (err, items) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send('An error occurred', err);
//         }
//         else {
//             res.render('imagesPage', { items: items });
//         }
//     });
// });

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

//I made an imagesPage.ejs but deleted it because mpngoose didnt like it. 
 
/////////////////////////////////////
// Routes and Routers
/////////////////////////////////////

//HomeRouter
app.use("/", HomeRouter);

/////////////////////////////////////
// App Listener
/////////////////////////////////////
app.listen(PORT, () =>
  log.white("🚀 Server Launch 🚀", `Listening on Port ${PORT}`)
);


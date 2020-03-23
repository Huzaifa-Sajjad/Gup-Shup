const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const mainRouter = require("./routes/mainRoutes");
const profileRouter = require("./routes/profileRoutes");
const searchRouter = require("./routes/searchRoutes");

const app = express();

// Setting the default templating engine to PUG
app.set("view engine", "pug");
// Setting up the static server
app.use("/static", express.static("public"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// Setting up sessions
app.use(
  session({
    secret: "!987_=*&^",
    resave: false,
    saveUninitialized: false
  })
);
// Middle-ware for storing session id in res.locals
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});
// Connecting mongoose to local mongoDb
mongoose.connect("mongodb://localhost:27017/gupshup");
// Initialize the connection object
let db = mongoose.connection;
// logging put any errors in db connection
db.on("error", console.error.bind(console, "Error-->"));
// Routing the routes to their respective files
app.use("/", mainRouter);
app.use("/profile", profileRouter);
app.use("/search", searchRouter);
// Middle-ware to throw 404 errors
app.use((req, res, next) => {
  let err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});
// Catchig the error and rendering content against it
app.use((err, req, res, next) => {
  res.locals.error = err;
  // TODO: render a page instead of sending the error
  res.send(err.message);
});
// Listening to port 3000 for requests
app.listen(3000, () => console.log("Express Application Runing on port 3000"));

var express = require("express"),
  mongoose = require("mongoose"),
  User = require("./models/User"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  flash = require("connect-flash"),
  morgan = require("morgan"),
  db = require("./config/database"),
  app = express();

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

// mongodb setup
mongoose.connect(
  db.database,
  () => console.log("DB connected..........")
);

require("./config/passport")(passport); // pass passport for configuration

app.set("view engine", "ejs");
app.use(morgan("dev")); // log every request to the console
app.use(allowCrossDomain); //CORS APPLY
// bodyparser setup
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// passport configure
app.use(
  require("express-session")({
    secret: "i am nirol",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes ======================================================================
require("./app/routes")(app, passport); // load our routes and pass in our app and fully configured passport

app.listen(process.env.PORT || 5000, () =>
  console.log("server running at: ", 5000)
);

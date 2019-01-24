var express = require("express"),
  mongoose = require("mongoose"),
  User = require("./models/User"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  flash = require("connect-flash"),
  morgan = require("morgan"),
  db = require("./config/database"),
  cors = require('cors'),
  path = require('path'),
  app = express();

  app.use(cors({
      origin:['http://localhost:3000'],
      methods:['GET','POST'],
      credentials: true // enable set cookie
  }));

// mongodb setup
mongoose.connect(
  db.database,
  () => console.log("DB connected..........")
);

app.use('/static', express.static(path.join(__dirname, 'uploads')))

require("./config/passport")(passport); // pass passport for configuration

app.set("view engine", "ejs");
app.use(morgan("dev")); // log every request to the console
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

app.use( (req, res, next) => {
  console.log('req.session', req.session);
  return next();
});

// routes ======================================================================
require("./app/routes")(app, passport); // load our routes and pass in our app and fully configured passport

app.listen(process.env.PORT || 5000, () =>
  console.log("server running at: ", 5000)
);

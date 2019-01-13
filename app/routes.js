var gravatar_url = require("gravatar-url");
var User = require("../models/User");
var Post = require("../models/Post");

module.exports = function(app, passport) {
  app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/secret",
      failureRedirect: "/login"
    }),
    (re, res) => {}
  );
  // signup routes....
  app.post("/signup", (req, res) => {
    var email = req.body.email,
      username = req.body.username,
      password = req.body.password;
    const newUser = new User({
      email,
      username,
      password,
      image: gravatar_url(req.body.email, { size: 500, default: "retro" })
    });

    newUser
      .save()
      .then(user => {
        res.json(user);
      })
      .catch(err => console.log(err));
  });

  // get all Users
  app.get("/users", (req, res) => {
    User.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => console.log(err));
  });

  // get a single user profile
  app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);
    User.findById(id)
      .populate("posts")
      .exec()
      .then(user => {
        res.json(user);
      })
      .catch(err => console.log(err));
  });

  // save post//
  app.post("/post/new", isLoggedIn, (req, res) => {
    var title = req.body.title,
      body = req.body.body;
    if (title && body) {
      const newPost = new Post({
        author: req.user._id,
        title,
        body
      });
      newPost
        .save()
        .then(post => {
          User.findById(req.user._id).then(user => {
            user.posts.push(post);
            user.save();
          });
          res.json(post);
        })
        .catch(err => res.send(err));
    } else {
      console.log("please fill all the inputs");
    }
  });

  // get all posts
  app.get("/posts", (req, res) => {
    Post.find()
      .populate("author")
      .exec()
      .then(posts => {
        res.json(posts);
      })
      .catch(err => res.send(err));
  });

  // get a single post
  app.get("/posts/:id", (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        res.send(post);
      })
      .catch(err => res.send(err));
  });

  // secured routes........
  app.get("/secret", isLoggedIn, (req, res) => {
    res.send("protected route");
  });

  // route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();

    // if they aren't redirect them to the home page
    res.send(false);
  }
};

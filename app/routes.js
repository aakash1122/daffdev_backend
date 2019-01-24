var User = require("../models/User");
var Post = require("../models/Post");
var multer = require("multer");
var path = require("path");

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "./uploads/")
  },
  filename: function(req, file, cb){
    cb(null, Date.now() +"-"+file.originalname)
  }
})

var fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  }else{
    cb(null, false)
  }
}

var upload = multer(
  {
    storage: storage,
    limits:{
  fileSize: 1024 * 1024
},
fileFilter: fileFilter
})

module.exports = function(app, passport) {
  app.get("/", (req, res) => {
    res.json(req.user)
  })
  // image route
app.get('/:image', (req, res) => {
  res.sendFile(path.join(__dirname,"../uploads/",req.params.image));
})

  app.post(
      '/login',
      passport.authenticate('local'),
      (req, res) => {
          var userInfo = {
              username: req.user.username
          };
          res.send(userInfo);
      }
  )
  // signup routes....
  app.post('/signup',upload.single("userImage"), (req, res) => {
    console.log(req.file);
    var email = req.body.email,
      username = req.body.username,
      password = req.body.password,
      image = req.file.filename
    const newUser = new User({
      email,
      username,
      password,
      image
    });
console.log(req.file);
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

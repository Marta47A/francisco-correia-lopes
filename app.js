//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();
const _ = require('lodash');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
// const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv/config');
const multer = require('multer');

let currentDate = Date.now();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));


const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    currentDate = Date.now();
    cb(null, file.fieldname + " - " + currentDate + ".jpg");
  }
});

const imageFilter = function(req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: imageFilter
});


app.use(session({
  secret: "This is a secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/francisco-correia-lopes_DB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);


//Users

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

const postSchema = {
  title: String,
  content: String,
  updatedOn: Date,
  photoName: String
};

const Post = mongoose.model("Post", postSchema);

const photoSchema = {
  title: String,
  titleEN: String,
  titleFR: String,
  theme: String,
  name: String
};

const Photo = mongoose.model("Photo", photoSchema);

// Authentication

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/home",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, done) {

    User.findOrCreate({
      googleId: profile.id
    }, function(err, user) {
      return done(err, user);
    });
  }
));


app.get("/", function(req, res) {
  Post.find().sort({
    updatedOn: -1
  }).limit(2).exec(function(err, posts) {
    res.render("home", {
      posts: posts
    });
  });
});


app.get("/auth/google",
  passport.authenticate('google', {
    scope: ["profile"]
  })
);

app.get("/auth/google/home",
  passport.authenticate('google', {
    failureRedirect: "/register"
  }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/");
  });

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  User.countDocuments({}, function(err, count) {
    if (err) {
      console.log(err);
    } else {
      if (count === 0) {
        res.render("register");
      } else {
        res.send("There already is an administrator.");
      }
    }
  });
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req, res) {

  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/");
      });
    }
  });

});

app.post("/login", function(req, res) {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/");
      });
    }
  });

});


//Posts

///////////////////////////////////Requests Targetting all posts////////////////////////

app.get("/posts", function(req, res) {
  Post.find().sort({
    updatedOn: -1
  }).exec(function(err, posts) {
    res.render("posts", {
      posts: posts
    });
  });
});


app.get("/add-post", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("add-post");
  } else {
    res.redirect("/login");
  }
});

app.post("/add-post", upload.single("postImage"), function(req, res) {

  const post = new Post({
    title: req.body.postTitle,
    titleEN: req.body.postTitleEN,
    titleFR: req.body.postTitleFR,
    content: req.body.postBody,
    contentEN: req.body.postBodyEN,
    contentFR: req.body.postBodyFR,
    updatedOn: Date.now(),
    photoName: "postImage - " + currentDate + ".jpg"
  });

  post.save(function(err) {
    if (!err) {
      // res.send("Successfully added a new post.");
      res.redirect("/posts");

    } else {
      res.send(err);
    }
  });

});



////////////////////////////////Requests Targetting A Specific Post////////////////////////

app.get("/posts/:postTitle", function(req, res) {

  Post.findOne({
    title: req.params.postTitle
  }, function(err, post) {
    if (post) {
      res.render("post", {
        post: post
      });
    } else {
      res.send("No posts matching that title were found.");
    }
  });
});

app.get("/posts/:postTitle/delete", function(req, res) {

  const postTitle = req.params.postTitle.split("%").join(" ");


  if (req.isAuthenticated()) {
    Post.deleteOne({
        title: postTitle
      },
      function(err) {
        if (!err) {
          res.redirect("/posts");
          // res.redirect("/");
          // res.render("photos/"+req.params.photoTheme);
        } else {
          res.send("No posts matching that title were found.");
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});



//Photos

///////////////////////////////////Requests Targetting all Photos////////////////////////


app.get("/add-photo", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("add-photo");
  } else {
    res.redirect("/login");
  }
});

app.post("/add-photo", upload.single("photoImage"), function(req, res, next) {

  const photo = new Photo({
    theme: req.body.photoTheme,
    name: "photoImage - " + currentDate + ".jpg"
  });

  photo.save(function(err) {
    if (!err) {
      res.redirect("/photos/" + req.body.photoTheme);

    } else {
      res.send(err);
    }
  });
});


app.get("/photos/:photoTheme", function(req, res) {
  Photo.find({
    theme: req.params.photoTheme
  }, function(err, photos) {
    if (!err) {
      res.render("photos", {
        photos: photos,
        requestedPhotoTheme: req.params.photoTheme
      });
    } else {
      res.send("No photos matching that title were found.");
    }

  });

});



////////////////////////////////Requests Targetting A Specific Photo////////////////////////

app.get("/photos/:photoTheme/:photoName", function(req, res) {

  const photoName = req.params.photoName.split("%").join(" ");

  Photo.findOne({
    name: photoName
  }, function(err, photo) {
    if (photo) {
      res.render("photo", {
        photo: photo
      });
    } else {
      res.send("No photos matching that title were found.");
    }
  });

});

app.get("/photos/:photoTheme/:photoName/delete", function(req, res) {

  const photoName = req.params.photoName.split("%").join(" ");


  if (req.isAuthenticated()) {
    Photo.deleteOne({
        name: photoName
      },
      function(err) {
        if (!err) {
          res.redirect("/photos/" + req.params.photoTheme);
          // res.redirect("/");
          // res.render("photos/"+req.params.photoTheme);
        } else {
          res.send("No photos matching that title were found.");
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});



const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Server started on port " + port);
});

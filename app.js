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
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv/config');


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname);
  }
});

var upload = multer({
  storage: storage
});

app.use(session({
  secret: "This is a secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/francisco-correia-lopes_DB", {
  useNewUrlParser: true
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
    callbackURL: "http://localhost:3000/auth/google/",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    User.findOrCreate({
      googleId: profile.id
    }, function(err, user) {
      return cb(err, user);
    });
  }
));

app.get("/auth/google",
  passport.authenticate('google', {
    scope: ["profile"]
  })
);

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  User.countDocuments({}, function(err, count) {
    if (err) {
      console.log(err)
    } else {
      if (count == 0) {
        res.render("register");
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
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
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
        res.redirect("/secrets");
      });
    }
  });

});


//Posts

///////////////////////////////////Requests Targetting all posts////////////////////////

const postSchema = {
  title: String,
  content: String,
  updatedOn: Date.now,
  img: {
    data: Buffer,
    contentType: String
  }
};

const Post = mongoose.model("Post", postSchema);



app.route("/posts")

  .get(function(req, res) {
    Post.find(function(err, posts) {
      if (!err) {
        res.send(posts);
      } else {
        res.send(err);
      }
    });
  })


  .post(upload.single('postImage'), function(req, res) {

      const post = new Post({
          title: req.body.postTitle,
          titleEN: req.body.postTitleEN,
          titleFR: req.body.postTitleFR,
          content: req.body.postBody,
          contentEN: req.body.postBodyEN,
          contentFR: req.body.postBodyFR,
          updatedOn: Date.now,
          img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
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

    // .delete(function(req, res){
    //
    //   Post.deleteMany(function(err){
    //     if (!err){
    //       res.send("Successfully deleted all posts.");
    //     } else {
    //       res.send(err);
    //     }
    //   });
    // });



    ////////////////////////////////Requests Targetting A Specific Post////////////////////////

    app.route("/posts/:postTitle")

    .get(function(req, res) {

      Post.findOne({
        title: req.params.postTitle
      }, function(err, post) {
        if (post) {
          res.send(post);
        } else {
          res.send("No posts matching that title were found.");
        }
      });
    })

    // .put(function(req, res) {
    //
    //   Post.update({
    //       title: req.params.postTitle
    //     }, {
    //       title: req.body.title,
    //       content: req.body.content
    //     }, {
    //       overwrite: true
    //     },
    //     function(err) {
    //       if (!err) {
    //         res.send("Successfully updated the selected post.");
    //       }
    //     }
    //   );
    // })

    .patch(function(req, res) {

      Post.update({
          title: req.params.postTitle
        }, {
          $set: req.body
        },
        function(err) {
          if (!err) {
            res.send("Successfully updated post.");
          } else {
            res.send(err);
          }
        }
      );
    })

    .delete(function(req, res) {

      Post.deleteOne({
          title: req.params.postTitle
        },
        function(err) {
          if (!err) {
            res.send("Successfully deleted the corresponding post.");
          } else {
            res.send(err);
          }
        }
      );
    });



    //Photos

    ///////////////////////////////////Requests Targetting all Photos////////////////////////

    const photoSchema = {
      title: String,
      titleEN: String,
      titleFR: String,
      theme: String,
      img: {
        data: Buffer,
        contentType: String
      }
    };

    const Photo = mongoose.model("Photo", photoSchema);

    app.route("/photos")

    .get(function(req, res) {
      Post.find(function(err, photos) {
        if (!err) {
          res.send(photos);
        } else {
          res.send(err);
        }
      });
    })

    .post(function(req, res) {

      const photo = new Photo({
        title: req.body.photoTitle,
        titleEN: req.body.photoTitleEN,
        titleFR: req.body.photoTitleFR,
        theme: req.body.photoTheme,
        img: {
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
          contentType: 'image/png'
        }
      });

      photo.save(function(err) {
        if (!err) {
          // res.send("Successfully added a new post.");
          res.redirect("/" + req.body.photoTheme);

        } else {
          res.send(err);
        }
      });
    });

    // .delete(function(req, res){
    //
    //   Photo.deleteMany(function(err){
    //     if (!err){
    //       res.send("Successfully deleted all photos.");
    //     } else {
    //       res.send(err);
    //     }
    //   });
    // });



    ////////////////////////////////Requests Targetting A Specific Photo////////////////////////

    app.route("/photos/:photoTitle")

    .get(function(req, res) {

      Photo.findOne({
        title: req.params.photoTitle
      }, function(err, photo) {
        if (photo) {
          res.send(photo);
        } else {
          res.send("No photos matching that title were found.");
        }
      });
    })

    // .put(function(req, res) {
    //
    //   Photo.update({
    //       title: req.params.photoTitle
    //     }, {
    //       title: req.body.photoTitle,
    //       theme: req.body.photoTheme,
    //       img.data = fs.readFileSync(req.body.photoImage),
    //       img.contentType = 'image / png'
    //     }, {
    //       overwrite: true
    //     },
    //     function(err) {
    //       if (!err) {
    //         res.send("Successfully updated the selected photo.");
    //       }
    //     }
    //   );
    // })

    .patch(function(req, res) {

      Photo.update({
          title: req.params.photoTitle
        }, {
          $set: req.body
        },
        function(err) {
          if (!err) {
            res.send("Successfully updated photo.");
          } else {
            res.send(err);
          }
        }
      );
    })

    .delete(function(req, res) {

      Photo.deleteOne({
          title: req.params.postTitle
        },
        function(err) {
          if (!err) {
            res.send("Successfully deleted the corresponding photo.");
          } else {
            res.send(err);
          }
        }
      );
    });


    app.get("/photos/:photoTheme", function(req, res) {

      const requestedPhotoTheme = _.startCase(req.params.photoTheme);


      Post.find({
        theme: photoTheme
      }, function(err, photos) {
        res.render("photos", {
          photos: photos
        });
      });

    });


    app.get("/", function(req, res) {
      Post.find().sort(updatedOn: -1).limit(2).toArray(function(err, posts) {
        res.render("home", {
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

    app.get("/add-photo", function(req, res) {
      if (req.isAuthenticated()) {
        res.render("add-photo");
      } else {
        res.redirect("/login");
      }
    });

    app.delete("/posts/:postTitle/delete", function(req, res) {
      if (req.isAuthenticated()) {
        res.render("posts");
      } else {
        res.redirect("/login");
      }
    });

    app.delete("/photos/:photoTitle/delete", function(req, res) {
      if (req.isAuthenticated()) {
        res.render("submit");
      } else {
        res.redirect("/");
      }
    });


    app.listen(3000, function() {
      console.log("Server started on port 3000");
    });

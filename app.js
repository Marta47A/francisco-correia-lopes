//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();
const _ = require('lodash');

const multer = require('multer');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.use(multer({
  dest: ‘. / uploads / ’,
  rename: function(fieldname, filename) {
    return filename;
  },
}));

mongoose.connect("mongodb://localhost:27017/francisco-correia-lopes_DB", {
  useNewUrlParser: true
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

  .post(function(req, res) {

    const post = new Post({
      title: req.body.postTitle,
      titleEN: req.body.postTitleEN,
      titleFR: req.body.postTitleFR,
      content: req.body.postBody,
      contentEN: req.body.postBodyEN,
      contentFR: req.body.postBodyFR,
      updatedOn: Date.now,
      img.data = fs.readFileSync(req.body.postImage),
      img.contentType = 'image / png'
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
      img.data = fs.readFileSync(req.body.photoImage),
      img.contentType = 'image / png'
    });

    photo.save(function(err) {
      if (!err) {
        // res.send("Successfully added a new post.");
        res.redirect("/"+req.body.photoTheme);

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

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.get("/add-photo", function(req, res) {
  res.render("add-photo");
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

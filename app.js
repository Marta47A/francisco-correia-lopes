//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const fs = require("fs");
const path = require("path");
require("dotenv/config");
const multer = require("multer");
const nodemailer = require("nodemailer");

const dataPT_ = fs.readFileSync("public/languages/PT.json", "utf8");
const dataPT = JSON.parse(dataPT_);

const dataEN_ = fs.readFileSync("public/languages/EN.json", "utf8");
const dataEN = JSON.parse(dataEN_);

const dataFR_ = fs.readFileSync("public/languages/FR.json", "utf8");
const dataFR = JSON.parse(dataFR_);

let currentDate = Date.now();

app.set("view engine", "ejs");

//app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(__dirname + "/public"));

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    currentDate = Date.now();
    cb(null, file.fieldname + " - " + currentDate + ".jpg");
  },
});

const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: imageFilter,
});

app.use(
  session({
    secret: "This is a secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(
  "mongodb+srv://admin-marta47a:" +
    process.env.PASS_MONGODB +
    "@cluster0.xca7w.mongodb.net/francisco-correia-lopes?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);
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
  titlePT: String,
  titleEN: String,
  titleFR: String,
  subtitlePT: String,
  subtitleEN: String,
  subtitleFR: String,
  contentPT: String,
  contentEN: String,
  contentFR: String,
  dateOfPost: Date,
  photoName: String,
};

const Post = mongoose.model("Post", postSchema);

const photoSchema = {
  titlePT: String,
  titleEN: String,
  titleFR: String,
  theme: String,
  name: String,
};

const Photo = mongoose.model("Photo", photoSchema);

// Authentication

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/PT/auth/google/home",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate(
        {
          googleId: profile.id,
        },
        function (err, user) {
          return done(err, user);
        }
      );
    }
  )
);

app.get("/", function (req, res) {
  res.redirect("/PT");
});

function wordsInLanguage(field, language) {
  let words;
  switch (language) {
    case "PT":
      words = dataPT[field];
      break;
    case "EN":
      words = dataEN[field];
      break;
    case "FR":
      words = dataFR[field];
      break;
  }
  return words;
}

app.get("/:language/", function (req, res) {
  const language = req.params.language;

  Post.find()
    .sort({
      dateOfPost: -1,
    })
    .limit(2)
    .exec(function (err, posts) {
      res.render("home", {
        posts: posts,
        language: language,
        name: wordsInLanguage("name", language),
        title: wordsInLanguage("title", language),
        keywords: wordsInLanguage("keywords", language),
        description: wordsInLanguage("description", language),
        home: wordsInLanguage("home", language),
        biography: wordsInLanguage("biography", language),
        dailyLife: wordsInLanguage("dailyLife", language),
        news: wordsInLanguage("news", language),
        contact: wordsInLanguage("contact", language),
        language2: wordsInLanguage("language2", language),
        language3: wordsInLanguage("language3", language),
        language2_text: wordsInLanguage("language2_text", language),
        language3_text: wordsInLanguage("language3_text", language),
        slogan: wordsInLanguage("slogan", language),
        contactMe: wordsInLanguage("contactMe", language),
        biography_text_1: wordsInLanguage("biography_text_1", language),
        biography_text_2: wordsInLanguage("biography_text_2", language),
        workEquitationTests: wordsInLanguage("workEquitationTests", language),
        ridingLessons: wordsInLanguage("ridingLessons", language),
        workTraining: wordsInLanguage("workTraining", language),
        bullfights: wordsInLanguage("bullfights", language),
        amateur: wordsInLanguage("amateur", language),
        professional: wordsInLanguage("professional", language),
        lastNews: wordsInLanguage("lastNews", language),
        readMore: wordsInLanguage("readMore", language),
        moreNews: wordsInLanguage("moreNews", language),
        contactMe_first_name: wordsInLanguage("contactMe_first_name", language),
        contactMe_last_name: wordsInLanguage("contactMe_last_name", language),
        contactMe_email: wordsInLanguage("contactMe_email", language),
        contactMe_msg: wordsInLanguage("contactMe_msg", language),
        contactMe_send: wordsInLanguage("contactMe_send", language),
        titleInLanguage: parameterInLanguage("title", language),
        contentInLanguage: parameterInLanguage("content", language),
      });
    });
});

app.post("/:language/", function (req, res) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const mailOptions = {
    from:
      '"' +
      req.body.firstName +
      " " +
      req.body.lastName +
      '" <' +
      req.body.email +
      ">", // sender address
    to: "franciscocorreialopes.website@gmail.com", // list of receivers
    subject:
      "[Website] Contacto por " + req.body.firstName + " " + req.body.lastName, // Subject line
    text: req.body.message + "\n\n" + req.body.email, // plain text body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      res.redirect("/" + req.params.language + "/send-successful");
    }
  });
});

app.get("/:language/biography", function (req, res) {
  const language = req.params.language;

  res.render("biography", {
    language: language,
    name: wordsInLanguage("name", language),
    title: wordsInLanguage("title", language),
    keywords: wordsInLanguage("keywords", language),
    description: wordsInLanguage("description", language),
    home: wordsInLanguage("home", language),
    biography: wordsInLanguage("biography", language),
    dailyLife: wordsInLanguage("dailyLife", language),
    news: wordsInLanguage("news", language),
    contact: wordsInLanguage("contact", language),
    language2: wordsInLanguage("language2", language),
    language3: wordsInLanguage("language3", language),
    language2_text: wordsInLanguage("language2_text", language),
    language3_text: wordsInLanguage("language3_text", language),
    biography_text_1: wordsInLanguage("biography_text_1", language),
    biography_text_2: wordsInLanguage("biography_text_2", language),
  });
});

app.get("/:language/daily-life", function (req, res) {
  const language = req.params.language;

  res.render("daily-life", {
    language: language,
    name: wordsInLanguage("name", language),
    title: wordsInLanguage("title", language),
    keywords: wordsInLanguage("keywords", language),
    description: wordsInLanguage("description", language),
    home: wordsInLanguage("home", language),
    biography: wordsInLanguage("biography", language),
    dailyLife: wordsInLanguage("dailyLife", language),
    news: wordsInLanguage("news", language),
    contact: wordsInLanguage("contact", language),
    language2: wordsInLanguage("language2", language),
    language3: wordsInLanguage("language3", language),
    language2_text: wordsInLanguage("language2_text", language),
    language3_text: wordsInLanguage("language3_text", language),
    workEquitationTests: wordsInLanguage("workEquitationTests", language),
    ridingLessons: wordsInLanguage("ridingLessons", language),
    workTraining: wordsInLanguage("workTraining", language),
    bullfights: wordsInLanguage("bullfights", language),
    amateur: wordsInLanguage("amateur", language),
    professional: wordsInLanguage("professional", language),
  });
});

app.get("/:language/contact", function (req, res) {
  const language = req.params.language;

  res.render("contact", {
    language: language,
    name: wordsInLanguage("name", language),
    title: wordsInLanguage("title", language),
    keywords: wordsInLanguage("keywords", language),
    description: wordsInLanguage("description", language),
    home: wordsInLanguage("home", language),
    biography: wordsInLanguage("biography", language),
    dailyLife: wordsInLanguage("dailyLife", language),
    news: wordsInLanguage("news", language),
    contact: wordsInLanguage("contact", language),
    language2: wordsInLanguage("language2", language),
    language3: wordsInLanguage("language3", language),
    language2_text: wordsInLanguage("language2_text", language),
    language3_text: wordsInLanguage("language3_text", language),
    contactMe: wordsInLanguage("contactMe", language),
    contactMe_first_name: wordsInLanguage("contactMe_first_name", language),
    contactMe_last_name: wordsInLanguage("contactMe_last_name", language),
    contactMe_email: wordsInLanguage("contactMe_email", language),
    contactMe_msg: wordsInLanguage("contactMe_msg", language),
    contactMe_send: wordsInLanguage("contactMe_send", language),
  });
});

app.post("/:language/contact", function (req, res) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const mailOptions = {
    from:
      '"' +
      req.body.firstName +
      " " +
      req.body.lastName +
      '" <' +
      req.body.email +
      ">", // sender address
    to: "franciscocorreialopes.website@gmail.com", // list of receivers
    subject:
      "[Website] Contacto por " + req.body.firstName + " " + req.body.lastName, // Subject line
    text: req.body.message + "\n\n" + req.body.email, // plain text body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      res.redirect("/" + req.params.language + "/send-successful");
    }
  });
});

app.get("/:language/send-successful", function (req, res) {
  const language = req.params.language;

  res.render("send-successful", {
    language: language,
    name: wordsInLanguage("name", language),
    title: wordsInLanguage("title", language),
    keywords: wordsInLanguage("keywords", language),
    description: wordsInLanguage("description", language),
    home: wordsInLanguage("home", language),
    biography: wordsInLanguage("biography", language),
    dailyLife: wordsInLanguage("dailyLife", language),
    news: wordsInLanguage("news", language),
    contact: wordsInLanguage("contact", language),
    language2: wordsInLanguage("language2", language),
    language3: wordsInLanguage("language3", language),
    language2_text: wordsInLanguage("language2_text", language),
    language3_text: wordsInLanguage("language3_text", language),
    sendSuccessful: wordsInLanguage("sendSuccessful", language),
  });
});

app.get(
  "/:language/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

app.get(
  "/:language/auth/google/home",
  passport.authenticate("google", {
    failureRedirect: "/PT/register",
  }),
  function (req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/" + req.params.language);
  }
);

app.get("/:language/login", function (req, res) {
  const language = req.params.language;

  res.render("login", {
    language: language,
    name: wordsInLanguage("name", language),
    title: wordsInLanguage("title", language),
    keywords: wordsInLanguage("keywords", language),
    description: wordsInLanguage("description", language),
    home: wordsInLanguage("home", language),
    biography: wordsInLanguage("biography", language),
    dailyLife: wordsInLanguage("dailyLife", language),
    news: wordsInLanguage("news", language),
    contact: wordsInLanguage("contact", language),
    language2: wordsInLanguage("language2", language),
    language3: wordsInLanguage("language3", language),
    language2_text: wordsInLanguage("language2_text", language),
    language3_text: wordsInLanguage("language3_text", language),
    login: wordsInLanguage("login", language),
    signIn: wordsInLanguage("signIn", language),
  });
});

app.get("/:language/register", function (req, res) {
  const language = req.params.language;

  User.countDocuments({}, function (err, count) {
    if (err) {
      console.log(err);
    } else {
      if (count === 0) {
        res.render("register", {
          language: language,
          name: wordsInLanguage("name", language),
          title: wordsInLanguage("title", language),
          keywords: wordsInLanguage("keywords", language),
          description: wordsInLanguage("description", language),
          home: wordsInLanguage("home", language),
          biography: wordsInLanguage("biography", language),
          dailyLife: wordsInLanguage("dailyLife", language),
          news: wordsInLanguage("news", language),
          contact: wordsInLanguage("contact", language),
          language2: wordsInLanguage("language2", language),
          language3: wordsInLanguage("language3", language),
          language2_text: wordsInLanguage("language2_text", language),
          language3_text: wordsInLanguage("language3_text", language),
          register: wordsInLanguage("register", language),
          signUp: wordsInLanguage("signUp", language),
        });
      } else {
        res.send("There already is an administrator.");
      }
    }
  });
});

app.get("/:language/logout", function (req, res) {
  req.logout();
  res.redirect("/" + req.params.language);
});

app.post("/:language/register", function (req, res) {
  User.register(
    {
      username: req.body.username,
    },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/" + req.params.language);
        });
      }
    }
  );
});

app.post("/:language/login", function (req, res) {
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/" + req.params.language);
      });
    }
  });
});

//Posts

///////////////////////////////////Requests Targetting all posts////////////////////////

function parameterInLanguage(word, language) {
  let words;
  switch (language) {
    case "PT":
      words = word + "PT";
      break;
    case "EN":
      words = word + "EN";
      break;
    case "FR":
      words = word + "FR";
      break;
  }
  return words;
}

function postsGetParameters(language, visibility, res) {
  Post.find()
    .sort({
      dateOfPost: -1,
    })
    .exec(function (err, posts) {
      res.render("posts", {
        posts: posts,
        language: language,
        name: wordsInLanguage("name", language),
        title: wordsInLanguage("title", language),
        keywords: wordsInLanguage("keywords", language),
        description: wordsInLanguage("description", language),
        home: wordsInLanguage("home", language),
        biography: wordsInLanguage("biography", language),
        dailyLife: wordsInLanguage("dailyLife", language),
        news: wordsInLanguage("news", language),
        contact: wordsInLanguage("contact", language),
        language2: wordsInLanguage("language2", language),
        language3: wordsInLanguage("language3", language),
        language2_text: wordsInLanguage("language2_text", language),
        language3_text: wordsInLanguage("language3_text", language),
        readMore: wordsInLanguage("readMore", language),
        add: wordsInLanguage("add", language),
        myDelete: wordsInLanguage("myDelete", language),
        update: wordsInLanguage("update", language),
        titleInLanguage: parameterInLanguage("title", language),
        contentInLanguage: parameterInLanguage("content", language),
        visibility: visibility,
      });
    });
}

app.get("/:language/posts", function (req, res) {
  const language = req.params.language;

  if (req.isAuthenticated()) {
    postsGetParameters(language, "block", res);
  } else {
    postsGetParameters(language, "none", res);
  }
});

app.get("/:language/posts/add-post", function (req, res) {
  const language = req.params.language;

  if (req.isAuthenticated()) {
    res.render("add-post", {
      language: language,
      name: wordsInLanguage("name", language),
      title: wordsInLanguage("title", language),
      keywords: wordsInLanguage("keywords", language),
      description: wordsInLanguage("description", language),
      home: wordsInLanguage("home", language),
      biography: wordsInLanguage("biography", language),
      dailyLife: wordsInLanguage("dailyLife", language),
      news: wordsInLanguage("news", language),
      contact: wordsInLanguage("contact", language),
      language2: wordsInLanguage("language2", language),
      language3: wordsInLanguage("language3", language),
      language2_text: wordsInLanguage("language2_text", language),
      language3_text: wordsInLanguage("language3_text", language),
      publishPost: wordsInLanguage("news", language),
      titlePT: wordsInLanguage("titlePT", language),
      titleEN: wordsInLanguage("titleEN", language),
      titleFR: wordsInLanguage("titleFR", language),
      subtitlePT: wordsInLanguage("subtitlePT", language),
      subtitleEN: wordsInLanguage("subtitleEN", language),
      subtitleFR: wordsInLanguage("subtitleFR", language),
      contentPT: wordsInLanguage("contentPT", language),
      contentEN: wordsInLanguage("contentEN", language),
      contentFR: wordsInLanguage("contentFR", language),
      image: wordsInLanguage("image", language),
      publish: wordsInLanguage("publish", language),
      dateOfPost: wordsInLanguage("dateOfPost", language),
    });
  } else {
    res.redirect("/" + language + "/login");
  }
});

app.post(
  "/:language/posts/add-post",
  upload.single("postImage"),
  function (req, res) {
    const post = new Post({
      titlePT: req.body.postTitlePT,
      titleEN: req.body.postTitleEN,
      titleFR: req.body.postTitleFR,
      subtitlePT: req.body.postSubtitlePT,
      subtitleEN: req.body.postSubtitleEN,
      subtitleFR: req.body.postSubtitleFR,
      contentPT: req.body.postBodyPT,
      contentEN: req.body.postBodyEN,
      contentFR: req.body.postBodyFR,
      dateOfPost: req.body.dateOfPost,
      photoName: "postImage - " + currentDate + ".jpg",
    });

    post.save(function (err) {
      if (!err) {
        // res.send("Successfully added a new post.");
        res.redirect("/" + req.params.language + "/posts");
      } else {
        res.send(err);
      }
    });
  }
);

////////////////////////////////Requests Targetting A Specific Post////////////////////////

function postGetParameters(id, language, visibility, res) {
  Post.findOne(
    {
      _id: id,
    },
    function (err, post) {
      if (post) {
        res.render("post", {
          post: post,
          language: language,
          name: wordsInLanguage("name", language),
          title: wordsInLanguage("title", language),
          keywords: wordsInLanguage("keywords", language),
          description: wordsInLanguage("description", language),
          home: wordsInLanguage("home", language),
          biography: wordsInLanguage("biography", language),
          dailyLife: wordsInLanguage("dailyLife", language),
          news: wordsInLanguage("news", language),
          contact: wordsInLanguage("contact", language),
          language2: wordsInLanguage("language2", language),
          language3: wordsInLanguage("language3", language),
          language2_text: wordsInLanguage("language2_text", language),
          language3_text: wordsInLanguage("language3_text", language),
          readMore: wordsInLanguage("readMore", language),
          visibility: visibility,
        });
      } else {
        res.send("No posts matching that title were found.");
      }
    }
  );
}

app.get("/:language/posts/:id", function (req, res) {
  const language = req.params.language;

  if (req.isAuthenticated()) {
    postGetParameters(req.params.id, language, "block", res);
  } else {
    postGetParameters(req.params.id, language, "none", res);
  }
});

app.get("/:language/posts/:id/update", function (req, res) {
  const language = req.params.language;

  Post.findOne(
    {
      _id: req.params.id,
    },
    function (err, post) {
      if (post) {
        res.render("edit-post", {
          post: post,
          language: language,
          name: wordsInLanguage("name", language),
          title: wordsInLanguage("title", language),
          keywords: wordsInLanguage("keywords", language),
          description: wordsInLanguage("description", language),
          home: wordsInLanguage("home", language),
          biography: wordsInLanguage("biography", language),
          dailyLife: wordsInLanguage("dailyLife", language),
          news: wordsInLanguage("news", language),
          contact: wordsInLanguage("contact", language),
          language2: wordsInLanguage("language2", language),
          language3: wordsInLanguage("language3", language),
          language2_text: wordsInLanguage("language2_text", language),
          language3_text: wordsInLanguage("language3_text", language),
          update: wordsInLanguage("update", language),
          save: wordsInLanguage("save", language),
          titlePT: wordsInLanguage("titlePT", language),
          titleEN: wordsInLanguage("titleEN", language),
          titleFR: wordsInLanguage("titleFR", language),
          subtitlePT: wordsInLanguage("subtitlePT", language),
          subtitleEN: wordsInLanguage("subtitleEN", language),
          subtitleFR: wordsInLanguage("subtitleFR", language),
          contentPT: wordsInLanguage("contentPT", language),
          contentEN: wordsInLanguage("contentEN", language),
          contentFR: wordsInLanguage("contentFR", language),
          dateOfPost: wordsInLanguage("dateOfPost", language),
        });
      } else {
        res.send("No posts matching that title were found.");
      }
    }
  );
});

app.post("/:language/posts/:id/update", function (req, res) {
  const language = req.params.language;

  Post.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      titlePT: req.body.postTitlePT,
      titleEN: req.body.postTitleEN,
      titleFR: req.body.postTitleFR,
      subtitlePT: req.body.postSubtitlePT,
      subtitleEN: req.body.postSubtitleEN,
      subtitleFR: req.body.postSubtitleFR,
      contentPT: req.body.postBodyPT,
      contentEN: req.body.postBodyEN,
      contentFR: req.body.postBodyFR,
      dateOfPost: req.body.dateOfPost,
    },
    function (err) {
      if (!err) {
        res.redirect("/" + language + "/posts");
      } else {
        res.send("No posts matching that title were found.");
      }
    }
  );
});


app.get("/:language/posts/:id/update-image", function (req, res) {
  const language = req.params.language;

  Post.findOne(
    {
      _id: req.params.id,
    },
    function (err, post) {
      if (post) {
        res.render("edit-post-image", {
          post: post,
          language: language,
          name: wordsInLanguage("name", language),
          title: wordsInLanguage("title", language),
          keywords: wordsInLanguage("keywords", language),
          description: wordsInLanguage("description", language),
          home: wordsInLanguage("home", language),
          biography: wordsInLanguage("biography", language),
          dailyLife: wordsInLanguage("dailyLife", language),
          news: wordsInLanguage("news", language),
          contact: wordsInLanguage("contact", language),
          language2: wordsInLanguage("language2", language),
          language3: wordsInLanguage("language3", language),
          language2_text: wordsInLanguage("language2_text", language),
          language3_text: wordsInLanguage("language3_text", language),
          update: wordsInLanguage("update", language),
          save: wordsInLanguage("save", language),
          image: wordsInLanguage("image", language),
        });
      } else {
        res.send("No posts matching that title were found.");
      }
    }
  );
});

app.post(
  "/:language/posts/:id/update-image",
  upload.single("postImage"),
  function (req, res) {
    const language = req.params.language;

    Post.findOne(
      {
        _id: req.params.id,
      },
      function (err, post) {
        if (post) {
          try {
            fs.unlinkSync("public/uploads/" + post.photoName);
          } catch (err) {
            // handle the error
          }
        } else {
          res.send("No posts matching that title were found.");
        }
      }
    );

    Post.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        photoName: "postImage - " + currentDate + ".jpg",
      },
      function (err) {
        if (!err) {
          res.redirect("/" + language + "/posts");
        } else {
          res.send("No posts matching that title were found.");
        }
      }
    );
  }
);

app.post("/:language/posts/:id/delete", function (req, res) {
  const language = req.params.language;

  if (req.isAuthenticated()) {
    Post.findOne(
      {
        _id: req.params.id,
      },
      function (err, post) {
        if (post) {
          try {
            fs.unlinkSync("public/uploads/" + post.photoName);
          } catch (err) {
            // handle the error
          }
        } else {
          res.send("No posts matching that title were found.");
        }
      }
    );
    Post.deleteOne(
      {
        _id: req.params.id,
      },
      function (err) {
        if (!err) {
          res.redirect("/" + language + "/posts");
        } else {
          res.send("No posts matching that title were found.");
        }
      }
    );
  } else {
    res.redirect("/" + language + "/login");
  }
});

//Photos

///////////////////////////////////Requests Targetting all Photos////////////////////////

function photosGetParameters(
  language,
  visibility,
  res,
  photoTheme,
  photoThemeInLanguageTitle,
  photoThemeInLanguageSubtitle
) {
  Photo.find(
    {
      theme: photoTheme,
    },
    function (err, photos) {
      if (!err) {
        res.render("photos", {
          photos: photos,
          photoTheme: photoTheme,
          language: language,
          name: wordsInLanguage("name", language),
          title: wordsInLanguage("title", language),
          keywords: wordsInLanguage("keywords", language),
          description: wordsInLanguage("description", language),
          home: wordsInLanguage("home", language),
          biography: wordsInLanguage("biography", language),
          dailyLife: wordsInLanguage("dailyLife", language),
          news: wordsInLanguage("news", language),
          contact: wordsInLanguage("contact", language),
          language2: wordsInLanguage("language2", language),
          language3: wordsInLanguage("language3", language),
          language2_text: wordsInLanguage("language2_text", language),
          language3_text: wordsInLanguage("language3_text", language),
          requestedPhotoThemeTitle: photoThemeInLanguageTitle,
          requestedPhotoThemeSubtitle: photoThemeInLanguageSubtitle,
          add: wordsInLanguage("add", language),
          myDelete: wordsInLanguage("myDelete", language),
          visibility: visibility,
          titleInLanguage: parameterInLanguage("title", language),
        });
      } else {
        res.send("No photos matching that title were found.");
      }
    }
  );
}

app.get("/:language/photos/:photoTheme", function (req, res) {
  const language = req.params.language;

  const photoTheme = req.params.photoTheme;
  const photoThemeSplit = photoTheme.split("-");
  const photoThemeTitle = photoThemeSplit[0];
  const photoThemeSubtitle = photoThemeSplit[1];
  let photoThemeInLanguageTitle;
  let photoThemeInLanguageSubtitle = "";

  if (photoThemeTitle === "bullfights") {
    photoThemeInLanguageTitle = wordsInLanguage(photoThemeTitle, language);
    photoThemeInLanguageSubtitle = wordsInLanguage(
      photoThemeSubtitle,
      language
    );
  } else {
    photoThemeInLanguageTitle = wordsInLanguage(
      _.camelCase([(string = photoTheme)]),
      language
    );
  }

  if (req.isAuthenticated()) {
    photosGetParameters(
      language,
      "block",
      res,
      photoTheme,
      photoThemeInLanguageTitle,
      photoThemeInLanguageSubtitle
    );
  } else {
    photosGetParameters(
      language,
      "none",
      res,
      photoTheme,
      photoThemeInLanguageTitle,
      photoThemeInLanguageSubtitle
    );
  }
});

app.get("/:language/photos/:photoTheme/add-photo", function (req, res) {
  const language = req.params.language;

  if (req.isAuthenticated()) {
    res.render("add-photo", {
      language: language,
      name: wordsInLanguage("name", language),
      title: wordsInLanguage("title", language),
      keywords: wordsInLanguage("keywords", language),
      description: wordsInLanguage("description", language),
      home: wordsInLanguage("home", language),
      biography: wordsInLanguage("biography", language),
      dailyLife: wordsInLanguage("dailyLife", language),
      news: wordsInLanguage("news", language),
      contact: wordsInLanguage("contact", language),
      language2: wordsInLanguage("language2", language),
      language3: wordsInLanguage("language3", language),
      language2_text: wordsInLanguage("language2_text", language),
      language3_text: wordsInLanguage("language3_text", language),
      photoTheme: req.params.photoTheme,
      addPhoto: wordsInLanguage("addPhoto", language),
      image: wordsInLanguage("image", language),
      add: wordsInLanguage("add", language),
      titlePT: wordsInLanguage("titlePT", language),
      titleEN: wordsInLanguage("titleEN", language),
      titleFR: wordsInLanguage("titleFR", language),
    });
  } else {
    res.redirect("/" + language + "/login");
  }
});

app.post(
  "/:language/photos/:photoTheme/add-photo",
  upload.single("photoImage"),
  function (req, res, next) {
    const photo = new Photo({
      theme: req.params.photoTheme,
      name: "photoImage - " + currentDate + ".jpg",
      titlePT: req.body.photoTitlePT,
      titleEN: req.body.photoTitleEN,
      titleFR: req.body.photoTitleFR,
    });

    photo.save(function (err) {
      if (!err) {
        res.redirect(
          "/" + req.params.language + "/photos/" + req.params.photoTheme
        );
      } else {
        res.send(err);
      }
    });
  }
);

////////////////////////////////Requests Targetting A Specific Photo////////////////////////

function photoGetParameters(id, photoTheme, language, visibility, res) {
  Photo.findOne(
    {
      _id: id,
    },
    function (err, photo) {
      if (photo) {
        res.render("photo", {
          photo: photo,
          language: language,
          name: wordsInLanguage("name", language),
          title: wordsInLanguage("title", language),
          keywords: wordsInLanguage("keywords", language),
          description: wordsInLanguage("description", language),
          home: wordsInLanguage("home", language),
          biography: wordsInLanguage("biography", language),
          dailyLife: wordsInLanguage("dailyLife", language),
          news: wordsInLanguage("news", language),
          contact: wordsInLanguage("contact", language),
          language2: wordsInLanguage("language2", language),
          language3: wordsInLanguage("language3", language),
          language2_text: wordsInLanguage("language2_text", language),
          language3_text: wordsInLanguage("language3_text", language),
          visibility: visibility,
          photoTheme: photoTheme,
        });
      } else {
        res.send("No photos matching that title were found.");
      }
    }
  );
}

app.get("/:language/photos/:photoTheme/:id", function (req, res) {
  const language = req.params.language;
  if (req.isAuthenticated()) {
    photoGetParameters(
      req.params.id,
      req.params.photoTheme,
      language,
      "block",
      res
    );
  } else {
    photoGetParameters(
      req.params.id,
      req.params.photoTheme,
      language,
      "none",
      res
    );
  }
});

app.get("/:language/photos/:photoTheme/:id/update", function (req, res) {
  const language = req.params.language;

  Photo.findOne(
    {
      _id: req.params.id,
    },
    function (err, photo) {
      if (photo) {
        res.render("edit-photo", {
          photo: photo,
          language: language,
          name: wordsInLanguage("name", language),
          title: wordsInLanguage("title", language),
          keywords: wordsInLanguage("keywords", language),
          description: wordsInLanguage("description", language),
          home: wordsInLanguage("home", language),
          biography: wordsInLanguage("biography", language),
          dailyLife: wordsInLanguage("dailyLife", language),
          news: wordsInLanguage("news", language),
          contact: wordsInLanguage("contact", language),
          language2: wordsInLanguage("language2", language),
          language3: wordsInLanguage("language3", language),
          language2_text: wordsInLanguage("language2_text", language),
          language3_text: wordsInLanguage("language3_text", language),
          update: wordsInLanguage("update", language),
          save: wordsInLanguage("save", language),
          titlePT: wordsInLanguage("titlePT", language),
          titleEN: wordsInLanguage("titleEN", language),
          titleFR: wordsInLanguage("titleFR", language),
        });
      } else {
        res.send("No photos matching that title were found.");
      }
    }
  );
});

app.post("/:language/photos/:photoTheme/:id/update", function (req, res) {
  const language = req.params.language;

  Photo.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      titlePT: req.body.titlePT,
      titleEN: req.body.titleEN,
      titleFR: req.body.titleFR,
    },
    function (err) {
      if (!err) {
        res.redirect("/" + language + "/photos/" + req.params.photoTheme);
      } else {
        res.send("No photos matching that title were found.");
      }
    }
  );
});

app.get("/:language/photos/:photoTheme/:id/update-image", function (req, res) {
  const language = req.params.language;

  Photo.findOne(
    {
      _id: req.params.id,
    },
    function (err, photo) {
      if (photo) {
        res.render("edit-photo-image", {
          photo: photo,
          language: language,
          name: wordsInLanguage("name", language),
          title: wordsInLanguage("title", language),
          keywords: wordsInLanguage("keywords", language),
          description: wordsInLanguage("description", language),
          home: wordsInLanguage("home", language),
          biography: wordsInLanguage("biography", language),
          dailyLife: wordsInLanguage("dailyLife", language),
          news: wordsInLanguage("news", language),
          contact: wordsInLanguage("contact", language),
          language2: wordsInLanguage("language2", language),
          language3: wordsInLanguage("language3", language),
          language2_text: wordsInLanguage("language2_text", language),
          language3_text: wordsInLanguage("language3_text", language),
          update: wordsInLanguage("update", language),
          save: wordsInLanguage("save", language),
          photoName: photo.photoName,
          image: wordsInLanguage("image", language),
        });
      } else {
        res.send("No photos matching that title were found.");
      }
    }
  );
});

app.post(
  "/:language/photos/:photoTheme/:id/update-image",
  upload.single("photoImage"),
  function (req, res) {
    const language = req.params.language;

    Photo.findOne(
      {
        _id: req.params.id,
      },
      function (err, photo) {
        if (photo) {
          try {
            fs.unlinkSync("public/uploads/" + photo.photoName);
          } catch (err) {
            // handle the error
          }
        } else {
          res.send("No photos matching that title were found.");
        }
      }
    );

    Photo.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        photoName: "postImage - " + currentDate + ".jpg",
      },
      function (err) {
        if (!err) {
          res.redirect("/" + language + "/photos/" + req.params.photoTheme);
        } else {
          res.send("No photos matching that title were found.");
        }
      }
    );
  }
);

app.post("/:language/photos/:photoTheme/:id/delete", function (req, res) {
  const language = req.params.language;

  if (req.isAuthenticated()) {
    Photo.findOne(
      {
        _id: req.params.id,
      },
      function (err, photo) {
        if (photo) {
          try {
            fs.unlinkSync("public/uploads/" + photo.name);
          } catch (err) {
            // handle the error
          }
        } else {
          res.send("No posts matching that title were found.");
        }
      }
    );
    Photo.deleteOne(
      {
        _id: req.params.id,
      },
      function (err) {
        if (!err) {
          res.redirect("/" + language + "/photos/" + req.params.photoTheme);
        } else {
          res.send("No photos matching that title were found.");
        }
      }
    );
  } else {
    res.redirect("/" + language + "/login");
  }
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("Server started on port " + port);
});

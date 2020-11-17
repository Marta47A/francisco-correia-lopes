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

var dataPT_=fs.readFileSync('public/Languages/PT.json', 'utf8');
var dataPT=JSON.parse(dataPT_);

var dataEN_=fs.readFileSync('public/Languages/EN.json', 'utf8');
var dataEN=JSON.parse(dataEN_);

var dataFR_=fs.readFileSync('public/Languages/FR.json', 'utf8');
var dataFR=JSON.parse(dataFR_);

let currentDate = Date.now();

app.set("view engine", "ejs");

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

mongoose.connect("mongodb://localhost:27017/francisco-correia-lopes_DB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
  titlePT: String,
  titleEN: String,
  titleFR: String,
  contentPT: String,
  contentEN: String,
  contentFR: String,
  updatedOn: Date,
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


const portuguese = "Português";
const english = "English";
const french = "Français";

let name;
let title;
let keywords;
let description;
let home;
let contact;
let biography;
let dailyLife;
let news;
let language2;
let language3;
let language2_text;
let language3_text;

app.get("/:language/", function (req, res) {

  let contactMe;
  let slogan;
  let biography_text_1;
  let biography_text_2;
  let workEquitationTests;
  let ridingLessons;
  let workTraining;
  let bullfights;
  let bullfights_amateur;
  let bullfights_professional;
  let lastNews;
  let readMore;
  let moreNews;
  let contactMe_first_name;
  let contactMe_last_name;
  let contactMe_email;
  let contactMe_msg;
  let contactMe_send;

  switch(req.params.language) {
    case "PT":
      name = dataPT.name;
      title = dataPT.title;
      keywords = dataPT.keywords;
      description = dataPT.description;
      home = dataPT.home;
      contact = dataPT.contact;
      contactMe = dataPT.contactMe;
      slogan = dataPT.slogan;
      biography = dataPT.biography;
      biography_text_1 = dataPT.biography_text_1;
      biography_text_2 = dataPT.biography_text_2;
      dailyLife = dataPT.dailyLife;
      workEquitationTests = dataPT.workEquitationTests;
      ridingLessons = dataPT.ridingLessons;
      workTraining = dataPT.workTraining;
      bullfights = dataPT.bullfights;
      bullfights_amateur = dataPT.bullfights_amateur;
      bullfights_professional = dataPT.bullfights_professional;
      lastNews = dataPT.lastNews;
      news = dataPT.news;
      readMore = dataPT.readMore;
      moreNews = dataPT.moreNews;
      contactMe_first_name = dataPT.contactMe_first_name;
      contactMe_last_name = dataPT.contactMe_last_name;
      contactMe_email = dataPT.contactMe_email;
      contactMe_msg = dataPT.contactMe_msg;
      contactMe_send = dataPT.contactMe_send;
      language2 ="EN";
      language3 ="FR";
      language2_text =english;
      language3_text =french;
      break;
    case "EN":
      name = dataEN.name;
      title = dataEN.title;
      keywords = dataEN.keywords;
      description = dataEN.description;
      home = dataEN.home;
      contact = dataEN.contact;
      contactMe = dataEN.contactMe;
      slogan = dataEN.slogan;
      biography = dataEN.biography;
      biography_text_1 = dataEN.biography_text_1;
      biography_text_2 = dataEN.biography_text_2;
      dailyLife = dataEN.dailyLife;
      workEquitationTests = dataEN.workEquitationTests;
      ridingLessons = dataEN.ridingLessons;
      workTraining = dataEN.workTraining;
      bullfights = dataEN.bullfights;
      bullfights_amateur = dataEN.bullfights_amateur;
      bullfights_professional = dataEN.bullfights_professional;
      lastNews = dataEN.lastNews;
      news = dataEN.news;
      readMore = dataEN.readMore;
      moreNews = dataEN.moreNews;
      contactMe_first_name = dataEN.contactMe_first_name;
      contactMe_last_name = dataEN.contactMe_last_name;
      contactMe_email = dataEN.contactMe_email;
      contactMe_msg = dataEN.contactMe_msg;
      contactMe_send = dataEN.contactMe_send;
      language2 ="PT";
      language3 ="FR";
      language2_text =portuguese;
      language3_text =french;
      break;
    case "FR":
      name = dataFR.name;
      title = dataFR.title;
      keywords = dataFR.keywords;
      description = dataFR.description;
      home = dataFR.home;
      contact = dataFR.contact;
      contactMe = dataFR.contactMe;
      slogan = dataFR.slogan;
      biography = dataFR.biography;
      biography_text_1 = dataFR.biography_text_1;
      biography_text_2 = dataFR.biography_text_2;
      dailyLife = dataFR.dailyLife;
      workEquitationTests = dataFR.workEquitationTests;
      ridingLessons = dataFR.ridingLessons;
      workTraining = dataFR.workTraining;
      bullfights = dataFR.bullfights;
      bullfights_amateur = dataFR.bullfights_amateur;
      bullfights_professional = dataFR.bullfights_professional;
      lastNews = dataFR.lastNews;
      news = dataFR.news;
      readMore = dataFR.readMore;
      moreNews = dataFR.moreNews;
      contactMe_first_name = dataFR.contactMe_first_name;
      contactMe_last_name = dataFR.contactMe_last_name;
      contactMe_email = dataFR.contactMe_email;
      contactMe_msg = dataFR.contactMe_msg;
      contactMe_send = dataFR.contactMe_send;
      language2 ="PT";
      language3 ="EN";      
      language2_text =portuguese;
      language3_text =english;
      break;
    default:
      // code block
    }

  Post.find()
    .sort({
      updatedOn: -1,
    })
    .limit(2)
    .exec(function (err, posts) {
      res.render("home", {
        posts: posts,
        language: req.params.language,
        name: name,
        title: title,
        keywords: keywords,
        description: description,
        home: home,
        contact: contact,
        contactMe: contactMe,
        slogan: slogan,
        biography: biography,
        biography_text_1: biography_text_1,
        biography_text_2: biography_text_2,
        dailyLife: dailyLife,
        workEquitationTests: workEquitationTests,
        ridingLessons: ridingLessons,
        workTraining: workTraining,
        bullfights: bullfights,
        bullfights_amateur: bullfights_amateur,
        bullfights_professional: bullfights_professional,
        lastNews: lastNews,
        news: news,
        readMore: readMore,
        moreNews: moreNews,
        contactMe_first_name: contactMe_first_name,
        contactMe_last_name: contactMe_last_name,
        contactMe_email: contactMe_email,
        contactMe_msg: contactMe_msg,
        contactMe_send: contactMe_send,
        language: req.params.language,
        language2: language2,
        language3: language3,
        language2_text: language2_text,
        language3_text: language3_text 
      });
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

  let login;
  let signIn;

  switch(req.params.language) {
    case "PT":
      login = dataPT.login;
      signIn = dataPT.signIn;
      name = dataPT.name;
      title = dataPT.title;
      keywords = dataPT.keywords;
      description = dataPT.description;
      home = dataPT.home;
      biography = dataPT.biography;
      dailyLife = dataPT.dailyLife;
      contact = dataPT.contact;
      news = dataPT.news;
      language2 ="EN";
      language3 ="FR";
      language2_text =english;
      language3_text =french;

      break;
    case "EN":
      login = dataEN.login;
      signIn = dataEN.signIn;
      name = dataEN.name;
      title = dataEN.title;
      keywords = dataEN.keywords;
      description = dataEN.description;
      home = dataEN.home;
      biography = dataEN.biography;
      dailyLife = dataEN.dailyLife;
      contact = dataEN.contact;
      news = dataEN.news;
      language2 ="PT";
      language3 ="FR";
      language2_text =portuguese;
      language3_text =french;
      break;
    case "FR":
      login = dataFR.login;
      signIn = dataFR.signIn;
      name = dataFR.name;
      title = dataFR.title;
      keywords = dataFR.keywords;
      description = dataFR.description;
      home = dataFR.home;
      biography = dataFR.biography;
      dailyLife = dataFR.dailyLife;
      contact = dataFR.contact;
      news = dataFR.news;
      language2 ="PT";
      language3 ="EN";      
      language2_text =portuguese;
      language3_text =english;
      break;
    default:
      // code block
    }
    res.render("login",{
      login: login,
      signIn: signIn,
      name: name,
      title: title,
      keywords: keywords,
      description: description,
      home: home,
      biography: biography,
      dailyLife: dailyLife,
      contact: contact,
      news: news,
      language: req.params.language,
      language2: language2,
      language3: language3,
      language2_text: language2_text,
      language3_text: language3_text
    });
});

app.get("/:language/register", function (req, res) {

  let register;
  let signUp;

  switch(req.params.language) {
    case "PT":
      register = dataPT.register;
      signUp = dataPT.signUp;
      name = dataPT.name;
      title = dataPT.title;
      keywords = dataPT.keywords;
      description = dataPT.description;
      home = dataPT.home;
      biography = dataPT.biography;
      dailyLife = dataPT.dailyLife;
      contact = dataPT.contact;
      news = dataPT.news;
      language2 ="EN";
      language3 ="FR";
      language2_text =english;
      language3_text =french;
      break;
    case "EN":
      register = dataEN.register;
      signUp = dataEN.signUp;
      name = dataEN.name;
      title = dataEN.title;
      keywords = dataEN.keywords;
      description = dataEN.description;
      home = dataEN.home;
      biography = dataEN.biography;
      dailyLife = dataEN.dailyLife;
      contact = dataEN.contact;
      news = dataEN.news;
      language2 ="PT";
      language3 ="FR";
      language2_text =portuguese;
      language3_text =french;
      break;
    case "FR":
      register = dataFR.register;
      signUp = dataFR.signUp;
      name = dataFR.name;
      title = dataFR.title;
      keywords = dataFR.keywords;
      description = dataFR.description;
      home = dataFR.home;
      biography = dataFR.biography;
      dailyLife = dataFR.dailyLife;
      contact = dataFR.contact;
      news = dataFR.news;
      language2 ="PT";
      language3 ="EN";      
      language2_text =portuguese;
      language3_text =english;
      break;
    default:
      // code block
    }

  User.countDocuments({}, function (err, count) {
    if (err) {
      console.log(err);
    } else {
      if (count === 0) {
        res.render("register",{
          register: register,
          signUp: signUp,
          name: name,
          title: title,
          keywords: keywords,
          description: description,
          home: home,
          biography: biography,
          dailyLife: dailyLife,
          contact: contact,
          news: news,
          language: req.params.language,
          language2: language2,
          language3: language3,
          language2_text: language2_text,
          language3_text: language3_text 
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
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

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

app.get("/:language/posts", function (req, res) {

  switch(req.params.language) {
    case "PT":
      name = dataPT.name;
      title = dataPT.title;
      keywords = dataPT.keywords;
      description = dataPT.description;
      home = dataPT.home;
      biography = dataPT.biography;
      dailyLife = dataPT.dailyLife;
      contact = dataPT.contact;
      news = dataPT.news;
      readMore = dataPT.readMore;
      language2 ="EN";
      language3 ="FR";
      language2_text =english;
      language3_text =french;
      break;
    case "EN":
      name = dataEN.name;
      title = dataEN.title;
      keywords = dataEN.keywords;
      description = dataEN.description;
      home = dataEN.home;
      biography = dataEN.biography;
      dailyLife = dataEN.dailyLife;
      contact = dataEN.contact;
      news = dataEN.news;
      readMore = dataEN.readMore;
      language2 ="PT";
      language3 ="FR";
      language2_text =portuguese;
      language3_text =french;
      break;
    case "FR":
      name = dataFR.name;
      title = dataFR.title;
      keywords = dataFR.keywords;
      description = dataFR.description;
      home = dataFR.home;
      biography = dataFR.biography;
      dailyLife = dataFR.dailyLife;
      contact = dataFR.contact;
      news = dataFR.news;
      readMore = dataFR.readMore;
      language2 ="PT";
      language3 ="EN";      
      language2_text =portuguese;
      language3_text =english;
      break;
    default:
      // code block
    }

  Post.find()
    .sort({
      updatedOn: -1,
    })
    .exec(function (err, posts) {
      res.render("posts", {
        posts: posts,
        language: req.params.language,
        name: name,
        title: title,
        keywords: keywords,
        description: description,
        home: home,
        biography: biography,
        dailyLife: dailyLife,
        contact: contact,
        news: news,
        readMore: readMore,
        language2: language2,
        language3: language3,
        language2_text: language2_text,
        language3_text: language3_text 
      });
    });
});

app.get("/:language/posts/add-post", function (req, res) {

  let publishPost;
  let titlePT;
  let titleEN;
  let titleFR;
  let contentPT;
  let contentEN;
  let contentFR;
  let image;
  let publish;

  switch(req.params.language) {
    case "PT":
      publishPost = dataPT.publishPost;
      titlePT = dataPT.titlePT;
      titleEN = dataPT.titleEN;
      titleFR = dataPT.titleFR;
      contentPT = dataPT.contentPT;
      contentEN = dataPT.contentEN;
      contentFR = dataPT.contentFR;
      image = dataPT.image;
      publish = dataPT.publish;
      name = dataPT.name;
      title = dataPT.title;
      keywords = dataPT.keywords;
      description = dataPT.description;
      home = dataPT.home;
      biography = dataPT.biography;
      dailyLife = dataPT.dailyLife;
      contact = dataPT.contact;
      news = dataPT.news;
      language2 ="EN";
      language3 ="FR";
      language2_text =english;
      language3_text =french;
      break;
    case "EN":
      publishPost = dataEN.publishPost;
      titlePT = dataEN.titlePT;
      titleEN = dataEN.titleEN;
      titleFR = dataEN.titleFR;
      contentPT = dataEN.contentPT;
      contentEN = dataEN.contentEN;
      contentFR = dataEN.contentFR;
      image = dataEN.image;
      publish = dataEN.publish;
      name = dataEN.name;
      title = dataEN.title;
      keywords = dataEN.keywords;
      description = dataEN.description;
      home = dataEN.home;
      biography = dataEN.biography;
      dailyLife = dataEN.dailyLife;
      contact = dataEN.contact;
      news = dataEN.news;
      language2 ="PT";
      language3 ="FR";
      language2_text =portuguese;
      language3_text =french;
      break;
    case "FR":
      publishPost = dataFR.publishPost;
      titlePT = dataFR.titlePT;
      titleEN = dataFR.titleEN;
      titleFR = dataFR.titleFR;
      contentPT = dataFR.contentPT;
      contentEN = dataFR.contentEN;
      contentFR = dataFR.contentFR;
      image = dataFR.image;
      publish = dataFR.publish;
      name = dataFR.name;
      title = dataFR.title;
      keywords = dataFR.keywords;
      description = dataFR.description;
      home = dataFR.home;
      biography = dataFR.biography;
      dailyLife = dataFR.dailyLife;
      contact = dataFR.contact;
      news = dataFR.news;
      language2 ="PT";
      language3 ="EN";      
      language2_text =portuguese;
      language3_text =english;

      break;
    default:
      // code block
    }

  if (req.isAuthenticated()) {
    res.render("add-post",{
      publishPost: publishPost,
      titlePT: titlePT,
      titleEN: titleEN,
      titleFR: titleFR,
      contentPT: contentPT,
      contentEN: contentEN,
      contentFR: contentFR,
      image: image,
      publish: publish,
      name: name,
      title: title,
      keywords: keywords,
      description: description,
      home: home,
      biography: biography,
      dailyLife: dailyLife,
      contact: contact,
      news: news,
      language: req.params.language,
      language2: language2,
      language3: language3,
      language2_text: language2_text,
      language3_text: language3_text
    });
  } else {
    res.redirect("/" + req.params.language + "/login");
  }
});

app.post("/:language/posts/add-post", upload.single("postImage"), function (
  req,
  res
) {
  const post = new Post({
    titlePT: req.body.postTitlePT,
    titleEN: req.body.postTitleEN,
    titleFR: req.body.postTitleFR,
    contentPT: req.body.postBodyPT,
    contentEN: req.body.postBodyEN,
    contentFR: req.body.postBodyFR,
    updatedOn: Date.now(),
    photoName: "postImage - " + currentDate + ".jpg"
  });

  post.save(function (err) {
    if (!err) {
      // res.send("Successfully added a new post.");
      res.redirect("/" + req.params.language + "/posts");
    } else {
      res.send(err);
    }
  });
});

////////////////////////////////Requests Targetting A Specific Post////////////////////////

app.get("/:language/posts/:id", function (req, res) {

  switch(req.params.language) {
    case "PT":
      readMore = dataPT.readMore;
      name = dataPT.name;
      title = dataPT.title;
      keywords = dataPT.keywords;
      description = dataPT.description;
      home = dataPT.home;
      biography = dataPT.biography;
      dailyLife = dataPT.dailyLife;
      contact = dataPT.contact;
      news = dataPT.news;
      language2 ="EN";
      language3 ="FR";
      language2_text =english;
      language3_text =french;
      break;
    case "EN":
      readMore = dataEN.readMore;
      name = dataEN.name;
      title = dataEN.title;
      keywords = dataEN.keywords;
      description = dataEN.description;
      home = dataEN.home;
      biography = dataEN.biography;
      dailyLife = dataEN.dailyLife;
      contact = dataEN.contact;
      news = dataEN.news;
      language2 ="PT";
      language3 ="FR";
      language2_text =portuguese;
      language3_text =french;
      break;
    case "FR":
      readMore = dataFR.readMore;
      name = dataFR.name;
      title = dataFR.title;
      keywords = dataFR.keywords;
      description = dataFR.description;
      home = dataFR.home;
      biography = dataFR.biography;
      dailyLife = dataFR.dailyLife;
      contact = dataFR.contact;
      news = dataFR.news;
      language2 ="PT";
      language3 ="EN";      
      language2_text =portuguese;
      language3_text =english;
      break;
    default:
      // code block
    }

  Post.findOne(
    {
      _id: req.params.id,
    },
    function (err, post) {
      if (post) {
        res.render("post", {
          post: post,
          language: req.params.language,
          readMore: readMore,
          name: name,
          title: title,
          keywords: keywords,
          description: description,
          home: home,
          biography: biography,
          dailyLife: dailyLife,
          contact: contact,
          news: news,
          language2: language2,
          language3: language3,
          language2_text: language2_text,
          language3_text: language3_text 
        });
      } else {
        res.send("No posts matching that title were found.");
      }
    }
  );
});

app.get("/:language/posts/:id/delete", function (req, res) {
  if (req.isAuthenticated()) {
    Post.deleteOne(
      {
        _id: req.params.id,
      },
      function (err) {
        if (!err) {
          res.redirect("/" + req.params.language + "/posts");
          // res.redirect("/");
          // res.render("photos/"+req.params.photoTheme);
        } else {
          res.send("No posts matching that title were found.");
        }
      }
    );
  } else {
    res.redirect("/" + req.params.language + "/login");
  }
});

//Photos

///////////////////////////////////Requests Targetting all Photos////////////////////////

app.get("/:language/photos/:photoTheme", function (req, res) {

  const photoTheme = req.params.photoTheme;
  const photoThemeSplit = photoTheme.split("-");
  const photoThemeTitle = photoThemeSplit[0];
  let photoThemeInLanguageTitle;
  let photoThemeInLanguageSubtitle = "";


  switch(req.params.language) {
    case "PT":
      if(photoThemeInLanguageTitle==="bullfights"){
        photoThemeInLanguageTitle = dataPT[photoThemeTitle];
        photoThemeInLanguageSubtitle = dataPT[photoTheme];
      }
      else{
        photoThemeInLanguageTitle = dataPT[photoTheme];
      }
      name = dataPT.name;
      title = dataPT.title;
      keywords = dataPT.keywords;
      description = dataPT.description;
      home = dataPT.home;
      biography = dataPT.biography;
      dailyLife = dataPT.dailyLife;
      contact = dataPT.contact;
      news = dataPT.news;
      language2 ="EN";
      language3 ="FR";
      language2_text =english;
      language3_text =french;
      break;
    case "EN":
      if(photoThemeInLanguageTitle==="bullfights"){
        photoThemeInLanguageTitle = dataEN[photoThemeTitle];
        photoThemeInLanguageSubtitle = dataEN[photoTheme];
      }
      else{
        photoThemeInLanguageTitle = dataEN[photoTheme];
      }
      name = dataEN.name;
      title = dataEN.title;
      keywords = dataEN.keywords;
      description = dataEN.description;
      home = dataEN.home;
      biography = dataEN.biography;
      dailyLife = dataEN.dailyLife;
      contact = dataEN.contact;
      news = dataEN.news;
      language2 ="PT";
      language3 ="FR";
      language2_text =portuguese;
      language3_text =french;
      break;
    case "FR":
      if(photoThemeInLanguageTitle==="bullfights"){
        photoThemeInLanguageTitle = dataFR[photoThemeTitle];
        photoThemeInLanguageSubtitle = dataFR[photoTheme];
      }
      else{
        photoThemeInLanguageTitle = dataFR[photoTheme];
      }
      name = dataFR.name;
      title = dataFR.title;
      keywords = dataFR.keywords;
      description = dataFR.description;
      home = dataFR.home;
      biography = dataFR.biography;
      dailyLife = dataFR.dailyLife;
      contact = dataFR.contact;
      news = dataFR.news;
      language2 ="PT";
      language3 ="EN";      
      language2_text =portuguese;
      language3_text =english;
      break;
    default:
      // code block
  }

  Photo.find(
    {
      theme: photoTheme,
    },
    function (err, photos) {
      if (!err) {
        res.render("photos", {
          photos: photos,
          requestedPhotoThemeTitle: photoThemeInLanguageTitle,
          requestedPhotoThemeSubtitle: photoThemeInLanguageSubtitle,
          language: req.params.language,
          name: name,
          title: title,
          keywords: keywords,
          description: description,
          home: home,
          biography: biography,
          dailyLife: dailyLife,
          contact: contact,
          news: news,
          language2: language2,
          language3: language3,
          language2_text: language2_text,
          language3_text: language3_text 
        });
      } else {
        res.send("No photos matching that title were found.");
      }
    }
  );
});

app.get("/:language/photos/:photoTheme/add-photo", function (req, res) {

  let addPhoto;
  let image;
  let add;

  switch(req.params.language) {
    case "PT":
      addPhoto = dataPT.addPhoto;
      image = dataPT.image;
      add = dataPT.add;
      name = dataPT.name;
      title = dataPT.title;
      keywords = dataPT.keywords;
      description = dataPT.description;
      home = dataPT.home;
      biography = dataPT.biography;
      dailyLife = dataPT.dailyLife;
      contact = dataPT.contact;
      news = dataPT.news;
      language2 ="EN";
      language3 ="FR";
      language2_text =english;
      language3_text =french;
      break;
    case "EN":
      addPhoto = dataEN.addPhoto;
      image = dataEN.image;
      add = dataEN.add;
      name = dataEN.name;
      title = dataEN.title;
      keywords = dataEN.keywords;
      description = dataEN.description;
      home = dataEN.home;
      biography = dataEN.biography;
      dailyLife = dataEN.dailyLife;
      contact = dataEN.contact;
      news = dataEN.news;
      language2 ="PT";
      language3 ="FR";
      language2_text =portuguese;
      language3_text =french;
      break;
    case "FR":
      addPhoto = dataFR.addPhoto;
      image = dataFR.image;
      add = dataFR.add;
      name = dataFR.name;
      title = dataFR.title;
      keywords = dataFR.keywords;
      description = dataFR.description;
      home = dataFR.home;
      biography = dataFR.biography;
      dailyLife = dataFR.dailyLife;
      contact = dataFR.contact;
      news = dataFR.news;
      language2 ="PT";
      language3 ="EN";      
      language2_text =portuguese;
      language3_text =english;
      break;
    default:
      // code block
    }

  if (req.isAuthenticated()) {
    res.render("add-photo", { 
      photoTheme: req.params.photoTheme,
      addPhoto: addPhoto,
      image: image,
      add: add,
      name: name,
      title: title,
      keywords: keywords,
      description: description,
      home: home,
      biography: biography,
      dailyLife: dailyLife,
      contact: contact,
      news: news,
      language: req.params.language,
      language2: language2,
      language3: language3,
      language2_text: language2_text,
      language3_text: language3_text
    });
  } else {
    res.redirect("/" + req.params.language + "/login");
  }
});

app.post(
  "/:language/photos/:photoTheme/add-photo",
  upload.single("photoImage"),
  function (req, res, next) {
    const photo = new Photo({
      theme: req.params.photoTheme,
      name: "photoImage - " + currentDate + ".jpg"
    });

    photo.save(function (err) {
      if (!err) {
        res.redirect("/" + req.params.language + "/photos/" + req.params.photoTheme);
      } else {
        res.send(err);
      }
    });
  }
);

////////////////////////////////Requests Targetting A Specific Photo////////////////////////

app.get("/:language/photos/:photoTheme/:id", function (req, res) {

  switch(req.params.language) {
    case "PT":
      name = dataPT.name;
      title = dataPT.title;
      keywords = dataPT.keywords;
      description = dataPT.description;
      home = dataPT.home;
      biography = dataPT.biography;
      dailyLife = dataPT.dailyLife;
      contact = dataPT.contact;
      news = dataPT.news;
      language2 ="EN";
      language3 ="FR";
      language2_text =english;
      language3_text =french;
      break;
    case "EN":
      name = dataEN.name;
      title = dataEN.title;
      keywords = dataEN.keywords;
      description = dataEN.description;
      home = dataEN.home;
      biography = dataEN.biography;
      dailyLife = dataEN.dailyLife;
      contact = dataEN.contact;
      news = dataEN.news;
      language2 ="PT";
      language3 ="FR";
      language2_text =portuguese;
      language3_text =french;
      break;
    case "FR":
      name = dataFR.name;
      title = dataFR.title;
      keywords = dataFR.keywords;
      description = dataFR.description;
      home = dataFR.home;
      biography = dataFR.biography;
      dailyLife = dataFR.dailyLife;
      contact = dataFR.contact;
      news = dataFR.news;
      language2 ="PT";
      language3 ="EN";      
      language2_text =portuguese;
      language3_text =english;
      break;
    default:
      // code block
    }

  Photo.findOne(
    {
      _id: req.params.id,
    },
    function (err, photo) {
      if (photo) {
        res.render("photo", {
          photo: photo,
          language: req.params.language,
          name: name,
          title: title,
          keywords: keywords,
          description: description,
          home: home,
          biography: biography,
          dailyLife: dailyLife,
          contact: contact,
          news: news,
          language2: language2,
          language3: language3,
          language2_text: language2_text,
          language3_text: language3_text 
        });
      } else {
        res.send("No photos matching that title were found.");
      }
    }
  );
});

app.get("/:language/photos/:photoTheme/:id/delete", function (req, res) {
  if (req.isAuthenticated()) {
    Photo.deleteOne(
      {
        _id: req.params.id,
      },
      function (err) {
        if (!err) {
          res.redirect("/" + req.params.language + "/photos/" + req.params.photoTheme);
        } else {
          res.send("No photos matching that title were found.");
        }
      }
    );
  } else {
    res.redirect("/" + req.params.language + "/login");
  }
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("Server started on port " + port);
});

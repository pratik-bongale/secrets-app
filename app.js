require("dotenv").config()
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

// Configure Express
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(session({
  secret: process.env.SECRET_PHRASE,
  resave: true,
  saveUninitialized: false
}));

app.use(passport.initialize());
// Configure passport.js
app.use(passport.session());

// Configure Mongoose
// mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
const connection_string = process.env.MONGODB_CONN;
mongoose.connect(connection_string, {
  useNewUrlParser : true,
  useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  secret: String
})

userSchema.plugin(passportLocalMongoose);
// passportLocalMongoose will automatically add a username, hash and salt fields + some methods to userSchema
const User = mongoose.model("User", userSchema);

// Configure passport-local
passport.use(User.createStrategy());  // defines the method pf authentication
passport.serializeUser(User.serializeUser()); // defines serialization logic to serialize session mongodb document into JSON (cookies)
passport.deserializeUser(User.deserializeUser()); // helps derialize session mongodb document into JSON (cookies)

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {

  User.register({username: req.body.username}, req.body.password, function(err, user) {
    if(err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    }
  })
})

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if(err) {
      console.log("login failed");
      res.redirect("/login");
    } else {
      // this sends a cookie to the browser and saves it
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    }
  })

})

app.get("/secrets", function(req, res) {
  User.find({ "secret" : { $exists : true } }, function(err, foundUsers) {
    res.render("secrets", {usersWithSecret: foundUsers});
  })

});

app.get("/submit", function(req, res) {
  if(req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("login");
  }
})

app.post("/submit", function(req, res) {
  const submittedMessage = req.body.secret;

  User.findById(req.user.id, function(err, foundUser) {
    if(err) {
      console.log(err);
      res.redirect("/submit");
    }

    if(foundUser) {
      // console.log(foundUser);
      foundUser.secret = submittedMessage;
      foundUser.save(function() {
          res.redirect("/secrets");
      });
    }
  })

})

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
})

const port = process.env.PORT;
app.listen(port || 3000, () => {
  console.log("Server started successfully on port 3000");
})

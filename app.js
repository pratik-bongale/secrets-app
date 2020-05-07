require("dotenv").config()
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
//const encrypt = require("mongoose-encryption");
//const md5 = require("md5");
// const bcrypt = require("bcrypt");

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(session({
  secret: "Our little secret.",
  resave: true,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

//userSchema.plugin(encrypt, {secret: process.end.SECRET, encryptedFields: ["password"]});
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// app.post("/register", (req, res) => {
//   const saltRounds = 10;
//   bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//     const newUser = new User({
//       email: req.body.username,
//       // password: md5(req.body.password)
//       password: hash
//     });
//
//     newUser.save((err) => {
//       if(err) {
//         res.send("New User creation failed");
//       } else {
//         res.render("secrets");
//       }
//     });
//   });
//
// });

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

// app.post("/login", (req, res) => {
//   User.findOne({email: req.body.username}, (err, foundResult) => {
//     if(err) {
//       res.send("Error occured while trying to login");
//     } else {
//
//       if(foundResult) {
//         bcrypt.compare(req.body.password, foundResult.password).then(function(result) {
//             if( result === true ) {
//               res.render("secrets");
//             } else {
//               res.send("Incorrect username / password");
//             }
//         });
//       }
//       // if(foundResult.password === md5(req.body.password)) {
//       // if(foundResult.password === req.body.password) {
//       //   res.render("secrets");
//       // } else {
//       //   res.send("Incorrect username / password");
//       // }
//     }
//   });
// });

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

  if(req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("login");
  }

});

app.get("/logout", function(req, res) {
  req.logout();
  req.redirect("/");
})

app.listen(3000, () => {
  console.log("Server started successfully on port 3000");
})

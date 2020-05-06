require("dotenv").config()
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
//const md5 = require("md5");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

//userSchema.plugin(encrypt, {secret: process.end.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  User.findOne({email: req.body.username}, (err, foundResult) => {
    if(err) {
      res.send("Error occured while trying to login");
    } else {

      if(foundResult) {
        bcrypt.compare(req.body.password, foundResult.password).then(function(result) {
            if( result === true ) {
              res.render("secrets");
            } else {
              res.send("Incorrect username / password");
            }
        });
      }
      // if(foundResult.password === md5(req.body.password)) {
      // if(foundResult.password === req.body.password) {
      //   res.render("secrets");
      // } else {
      //   res.send("Incorrect username / password");
      // }
    }
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const saltRounds = 10;
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      // password: md5(req.body.password)
      password: hash
    });

    newUser.save((err) => {
      if(err) {
        res.send("New User creation failed");
      } else {
        res.render("secrets");
      }
    });
  });


});

app.listen(3000, () => {
  console.log("Server started successfully on port 3000");
})

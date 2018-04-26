const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");
const sendAwesomeMail = require("../mail/sendMail");
const multer  = require('multer');
const upload = multer({ dest: './public/uploads/' });


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

authRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/plans/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", upload.single('photo'), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const birth = req.body.birth;
  const profilePic = `/uploads/${req.file.filename}`;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const confirmationCode = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      birth,
      confirmationCode,
      profilePic
    });

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        sendAwesomeMail(email, { code: confirmationCode })
          .then(() => {
            req.flash("info", "MENSAJE ENVIADO");
          })
          .catch(error => {
            req.flash("info", "ERROR, NO SE HA PODIDO ENVIAR EL MENSAJE");
            next(error);
          });
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

authRoutes.get("/confirm/:confirmationCode", (req, res, next) => {
  User.findOneAndUpdate(
    { confirmationCode: req.params.confirmationCode },
    { status: true }
  )
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("error", { err });
    });
});

authRoutes.post("/editProfile", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  const updated = {
    username,
    password: hashPass
  };
  User.findByIdAndUpdate(req.user.id, updated).then(user => {
    res.redirect('/auth/profile');
  });
});

authRoutes.get("/addStar/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, {$inc: {stars: 1}}, {new:true}).then(user => {
    console.log("added");
  });
});

authRoutes.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    let id = req.user.id;
    User.findById(id)
    .then(user =>{
      res.render("auth/profile", { user });
    });
  } else {
    res.redirect("auth/login");
  }
});
module.exports = authRoutes;

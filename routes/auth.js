const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");
const sendAwesomeMail = require("../mail/sendMail");

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

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const birth = req.body.birth;

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
      confirmationCode
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

authRoutes.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    let user = req.user;
    res.render("auth/profile", { user });
  } else {
    res.redirect("auth/login");
  }
});
module.exports = authRoutes;

const express = require("express");
const router = express.Router();
const debug = require("../log")(__filename);
const Review = require("../models/Review");

/* CRUD -> Create */
router.get("/new", (req, res) => {
  res.render("/reviews/reviews_new");
});

router.post("/new", (req, res) => {
  const { reviewer, reviewed, description, score } = req.body;
  const plan = new Review({ reviewer, reviewed, description, score });
  plan
    .save()
    .then(plan => {
      debug("Mistaken");
      debug(plan);
      res.redirect("/");
    })
    .catch(err => {
      res.render("error", { err });
    });
});

/* CRUD -> Read */

module.exports = router;

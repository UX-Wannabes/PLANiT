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
  const review = new Review({ reviewer, reviewed, description, score });
  review
    .save()
    .then(review => {
      debug("Mistaken");
      debug(plan);
      res.redirect("/");
    })
    .catch(err => {
      res.render("error", { err });
    });
});

/* CRUD -> Read */
router.get("/", (req, res) => {
  Review.find()
    .then(reviews => {
      res.render("/reviews/reviews", {
        reviews
      });
    })
    .catch(() => {
      res.render("/reviews/reviews");
    });
});

/* CRUD -> Update */
router.get("/:id/edit", (req, res) => {
  Review.findById(req.params.id).then(review => {
    res.render("Review-edit", { review });
  });
});

router.post("/:id/edit", (req, res) => {
  const { reviewer, reviewed, description, score } = req.body;
  const updates = { reviewer, reviewed, description, score };
  Review.findByIdAndUpdate(req.params.id, updates).then(() => {
    res.redirect("/reviews/reviews");
  });
});

/* CRUD -> Delete */
router.post("/:id/delete", (req, res) => {
  Review.findByIdAndRemove(req.params.id)
    .then(() => {
      debug("deleted");
      res.redirect("/reviews/reviews");
    })
    .catch(err => {
      debug(err);
    });
});

module.exports = router;

const express = require("express");

const router = express.Router();
const debug = require("../log")(__filename);

const Plan = require("../models/Plan");

/* CRUD -> Read */
router.get("/", (req, res) => {
  Plan.aggregate({
    $group: { _id: "$genre", total: { $sum: 1 } }
  }).then(plans => {
    res.render("plans/plans", { plans: JSON.stringify(plans) });
  });
});

router.get("/outdoors", (req, res) => {
  res.render("plans/outdoors");
});

router.get("/outdoors/chill", (req, res) => {
  Plan.find({ subgenre: "chill" })
    .populate("creator", "username")
    .then(plans => {
      res.render("plans/outdoors/chill", { plans });
    });
});

router.get("/outdoors/chill/:id", (req, res) => {
  Plan.findById(req.params.id).then(plan => {
    res.render("plans/outdoors/chill2", { plan });
  });
});

router.get("/outdoors/nightlife", (req, res) => {
  Plan.find({ subgenre: "nightlife" })
    .populate("creator", "username")
    .then(plans => {
      res.render("plans/outdoors/nightlife", { plans });
    });
});
router.get("/outdoors/nightlife/:id", (req, res) => {
  Plan.findById(req.params.id).then(plan => {
    res.render("plans/outdoors/nightlife2", { plan });
  });
});
router.get("/outdoors/otherplans", (req, res) => {
  Plan.find({ subgenre: "otherplans" })
    .populate("creator", "username")
    .then(plans => {
      res.render("plans/outdoors/otherplans", { plans });
    });
});

router.get("/outdoors/otherplans/:id", (req, res) => {
  Plan.findById(req.params.id).then(plan => {
    res.render("plans/outdoors/otherplans2", { plan });
  });
});

router.get("/games", (req, res) => {
  res.render("plans/games");
});

router.get("/games/board", (req, res) => {
  res.render("plans/games/board");
});

router.get("/games/online", (req, res) => {
  res.render("plans/games/online");
});

router.get("/movies", (req, res) => {
  Plan.find({ genre: "Movies" })
    .populate("creator", "username")
    .then(movies => {
      res.render("plans/movies/movies", { movies });
    });
});

/* CRUD -> Create */
router.get("/new", (req, res) => {
  res.render("plans/newPlan");
});

router.post("/new", (req, res) => {
  const { title, description, creator, genre, date } = req.body;

  const plan = new Plan({
    title,
    description,
    creator,
    genre,
    date
  });
  plan
    .save()
    .then(plan => {
      debug("Mistaken");
      debug(plan);
      res.render("plans/plans");
    })
    .catch(err => {
      res.render("error", { err });
    });
});

/* CRUD -> Update */
router.get("/:id/edit", (req, res) => {
  Plan.findById(req.params.id).then(plan => {
    res.render("Plan-edit", { plan });
  });
});

router.post("/:id/edit", (req, res) => {
  const { title, description, creator, genre, assistants, date } = req.body;
  const updates = { title, description, creator, genre, assistants, date };
  Plan.findByIdAndUpdate(req.params.id, updates).then(() => {
    res.redirect("plans/plans");
  });
});

/* CRUD -> Delete */
router.post("/:id/delete", (req, res) => {
  Plan.findByIdAndRemove(req.params.id)
    .then(() => {
      debug("deleted");
      res.redirect("plans/plans");
    })
    .catch(err => {
      debug(err);
    });
});

module.exports = router;

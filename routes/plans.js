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

router.get("/:genre", (req, res) => {
  res.render(`/plans/${req.params.genre}`);
});
router.get("/:genre/:subgenre", (req, res) => {
  res.render(`/plans/${req.params.genre}/${req.params.subgenre}`);
  Plan.find({ subgenre: req.params.subgenre })
    .populate("creator", "username")
    .then(plans => {
      res.render(`plans/${req.params.genre}/${req.params.subgenre}`, { plans });
    });
});
router.get("/:genre/:subgenre/:id", (req, res) => {
  Plan.findById(req.params.id).then(plan => {
    res.render(`plans/${req.params.genre}/${req.params.subgenre}-detail`, {
      plan
    });
  });
});
router.get("/:genre/:subgenre/:id/join", (req, res) => {
  Plan.findByIdAndUpdate(req.params.id, {
    $push: { assistants: req.user.id }
  }).then(() => {
    Plan.findById(req.params.id).then(plan => {
      res.redirect(`/plans/${plan.subgenre}/${plan.id}`);
    });
  });
});

module.exports = router;

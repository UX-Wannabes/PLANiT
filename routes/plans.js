const express = require("express");

const router = express.Router();
const debug = require("../log")(__filename);

const Plan = require("../models/Plan");

/* CRUD -> Read */
router.get("/", (req, res) => {
  Plan.find()
    .populate("creator", "username")
    .then(plans => {
      res.render("plans/plans", {
        plans
      });
    })
    .catch(() => {
      res.render("plans/plans");
    });
});

/* CRUD -> Create */
router.get("/new", (req, res) => {
  res.render("plans/plans_new");
});

router.post("/new", (req, res) => {
  const { title, description, creator, genre, assistants } = req.body;

  const plan = new Plan({ title, description, creator, genre, assistants });
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
  const { title, description, creator, genre, assistants } = req.body;
  const updates = { title, description, creator, genre, assistants };
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

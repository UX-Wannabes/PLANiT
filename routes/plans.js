const express = require("express");

const router = express.Router();
const debug = require("../log")(__filename);

const Plan = require("../models/Plan");

module.exports = router;

/* CRUD -> Create */
router.get("/new", (req, res) => {
  res.render("/plans/plans_new");
});


/* CRUD -> Read */
router.post("/new", (req, res) => {
  const { tittle, description, creator, genre, assistants } = req.body;

  const plan = new plan({ tittle,description,creator,genre,assistants });
  plan.save().then(plan => {
    debug("Mistaken");
    debug(plan);
    res.render("/plans/plans");
  });
});
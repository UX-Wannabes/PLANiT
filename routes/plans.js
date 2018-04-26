const express = require("express");
require("dotenv").config();

const router = express.Router();
const debug = require("../log")(__filename);

const Plan = require("../models/Plan");
const googleMapsClient = require("@google/maps").createClient({
  key: process.env.GOOGLEKEY,
  Promise: Promise
});

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
  const creator = req.user;
  const { title, description, genre, subgenre, date, address, hour } = req.body;
  // const address = req.body.address;
  googleMapsClient
    .geocode({ address })
    .asPromise()
    .then(response => {
      console.log(response.json.results[0].geometry.location);
      const loc = response.json.results[0].geometry.location;
      let location = {
        type: "Point",
        coordinates: [loc.lat, loc.lng]
      };
      const plan = new Plan({
        title,
        description,
        creator,
        genre,
        subgenre,
        date,
        hour,
        address,
        location
      });
      plan
        .save()
        .then(plan => {
          debug("Mistaken");
          debug(plan);
          req.user.plansCreated++;
          req.user.save();
          res.redirect("/plans");
        })
        .catch(err => {
          debug(err);
          res.render("error", { err });
        });
    })
    .catch(err => {
      debug("not funsiona 1");
      console.log(err);
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
  res.render(`plans/${req.params.genre}`);
});
router.get("/:genre/:subgenre", (req, res) => {
  Plan.find({ subgenre: req.params.subgenre })
    .populate("creator", "username")
    .then(plans => {
      res.render(`plans/${req.params.genre}/${req.params.subgenre}`, {
        plansMap: JSON.stringify(plans),
        plans
      });
    });
});
router.get("/:genre/:subgenre/:id", (req, res) => {
  Plan.findById(req.params.id)
    .populate("creator")
    .populate("assistants")
    .then(plan => {
      let date = plan.date.toLocaleDateString("es-ES");

      res.render(`plans/${req.params.genre}/${req.params.subgenre}-detail`, {
        plan: plan,
        date: date
      });
    });
});
router.get("/:genre/:subgenre/:id/join", (req, res) => {
  Plan.findByIdAndUpdate(req.params.id, {
    $push: { assistants: req.user.id }
  }).then(() => {
    Plan.findById(req.params.id).then(plan => {
      req.user.plansAssisted++;
      req.user.save();
      res.redirect(`/plans/${plan.genre}/${plan.subgenre}/${plan.id}`);
    });
  });
});

module.exports = router;

const express = require("express");

const router = express.Router();
const debug = require("../log")(__filename);

const Group = require("../models/Group");

/* CRUD -> Read */
router.get("/", (req, res) => {
  Group.find()
    .then(groups => {
      res.render("/groups/groups", {
        groups
      });
    })
    .catch(() => {
      res.render("/groups/groups");
    });
});

/* CRUD -> Create */
router.get("/new", (req, res) => {
  res.render("/groups/groups_new");
});

router.post("/new", (req, res) => {
  const { name, description, creator, genre, members } = req.body;

  const group = new Group({ name, description, creator, genre, members });
  group
    .save()
    .then(groups => {
      debug("Mistaken");
      debug(group);
      res.render("/groups/groups");
    })
    .catch(err => {
      res.render("error", { err });
    });
});

/* CRUD -> Update */
router.get("/:id/edit", (req, res) => {
  Group.findById(req.params.id).then(groups => {
    res.render("Group-edit", { group });
  });
});

router.post("/:id/edit", (req, res) => {
  const { name, description, creator, genre, members } = req.body;
  const updates = { name, description, creator, genre, members };
  Group.findByIdAndUpdate(req.params.id, updates).then(() => {
    res.redirect("/groups/groups");
  });
});

/* CRUD -> Delete */
router.post("/:id/delete", (req, res) => {
  Group.findByIdAndRemove(req.params.id)
    .then(() => {
      debug("deleted");
      res.redirect("/groups/groups");
    })
    .catch(err => {
      debug(err);
    });
});

module.exports = router;

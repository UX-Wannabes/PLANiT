const express = require("express");
const router = express.Router();
const debug = require("../log")(__filename);
const Report = require("../models/Report");

/* CRUD -> Create */
router.get("/new", (req, res) => {
  res.render("/reports/reports-new");
});

router.post("/new", (req, res) => {
  const { reporter, reported, message } = req.body;
  const report = new Report({ reporter, reported, message });
  report
    .save()
    .then(report => {
      debug("Mistaken");
      debug(report);
      res.redirect("/");
    })
    .catch(err => {
      res.render("error", { err });
    });
});

/* CRUD -> Read */
router.get("/", (req, res) => {
  Report.find()
    .then(reports => {
      res.render("/reports/reports", {
        reports
      });
    })
    .catch(() => {
      res.render("/reports/reports");
    });
});

/* CRUD -> Update */
router.get("/:id/edit", (req, res) => {
  Report.findById(req.params.id).then(report => {
    res.render("Report-edit", { report });
  });
});

router.post("/:id/edit", (req, res) => {
  const { reporter, reported, message } = req.body;
  const updates = { reporter, reported, message };
  Report.findByIdAndUpdate(req.params.id, updates).then(() => {
    res.redirect("/reports/reports");
  });
});

/* CRUD -> Delete */
router.post("/:id/delete", (req, res) => {
  Report.findByIdAndRemove(req.params.id)
    .then(() => {
      debug("deleted");
      res.redirect("/reports/reports");
    })
    .catch(err => {
      debug(err);
    });
});

module.exports = router;

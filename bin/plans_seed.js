require("dotenv").config();

const mongoose = require("mongoose");
const Plan = require("../models/Plan");
const plans_data = require("./plans_data");
const DBURL = process.env.DBURL;

mongoose.connect(DBURL).then(() => {
  console.log(`Connected to db ${DBURL}`);
  Plan.collection.drop();

  plans_data.forEach(plan_data => {
    let plan = new Plan(plan_data).save().then(() => {
      console.log("Created Plan");
      mongoose.disconnect();
    });
  });
});
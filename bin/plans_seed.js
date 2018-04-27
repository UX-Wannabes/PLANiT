require("dotenv").config();

const mongoose = require("mongoose");
const Plan = require("../models/Plan");
const plans_data = require("./plans_data");
const DBURL = process.env.DBURL;

mongoose.connect(
  'mongodb://pepe:1234@ds159509.mlab.com:59509/planify-ironhack'
  ).then(() => {
  console.log(`Connected to db 
  mongodb://<dbuser>:<dbpassword>@ds159509.mlab.com:59509/planify-ironhack
  `);
  Plan.collection.drop();

  plans_data.forEach(plan_data => {
    let plan = new Plan(plan_data).save().then(() => {
      console.log("Created Plan");
      mongoose.disconnect();
    });
  });
});
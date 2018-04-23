const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const planSchema = new Schema(
  {
    title: String,
    description: String,
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    genre: String,
    assistants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    date: Date,
    hour: Date //hour de date ?
    //chat
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan;

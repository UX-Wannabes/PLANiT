const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const planSchema = new Schema(
  {
    title: String,
    description: String,
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    genre: {type: String, enum:['movies', 'outdoors', 'games']},
    subgenre: {type: String, default: 'movies'},
    assistants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    date: Date,
    hour: Date, 
    address: String,
    location: { type: { type: String }, coordinates: [Number] }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);
planSchema.index({ location: "2dsphere" });

const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan;

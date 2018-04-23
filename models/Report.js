const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    reporter: { type: Schema.Types.ObjectId, ref: "User" },
    reported: { type: Schema.Types.ObjectId, ref: "User" },
    message: String
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;

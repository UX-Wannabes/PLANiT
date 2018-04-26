const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    birth: Date,
    plansCreated: { type: Number, default: 0 },
    plansAssisted: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    confirmationCode: String,
    status: { type: Boolean, default: false },
    profilePic: String
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

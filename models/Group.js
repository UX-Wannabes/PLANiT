const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const groupSchema = new Schema({
  name: String,
  description: String,
  creator: {type:Schema.Types.ObjectId, ref:"User"},
  genre: String,
  members: [{type:Schema.Types.ObjectId, ref:"User"}],
  //chat
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;

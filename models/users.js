const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  discordId: String,
  section: Number,
  discordName: {
    unique: false,
    type: String,
  },
  lastUpdate: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Users", userSchema);

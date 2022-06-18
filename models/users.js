const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  discordId: String,
  section: Number,
  discordName: {
    unique: false,
    type: String,
  },
});

module.exports = mongoose.model("Users", userSchema);

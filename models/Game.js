const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  Rank: Number,
  Name: { type: String, required: true },
  Platform: String,
  Year: Number,
  Genre: String,
  Publisher: String,
  Global_Sales: Number,
  imageUrl: String,
  imageAlt: String,
  imageCredit: String,
  imageCreditUrl: String,
  description: String,
  featured: Boolean,
});

module.exports = mongoose.model("Game", gameSchema);
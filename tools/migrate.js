require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Game = require("../models/Game");
const gameData = require("../data/dataset-with-images.json");

async function migrate() {
  try {
    await connectDB();

    await Game.deleteMany({});
    console.log("Existing data cleared.");
    
const cleanedData = gameData.map(item => ({
  ...item,
  Year: item.Year === "N/A" ? null : item.Year,
}));

const result = await Game.insertMany(cleanedData);    console.log(`${result.length} records inserted successfully.`);

    await mongoose.disconnect();
    console.log("MongoDB connection closed.");

  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}

migrate();
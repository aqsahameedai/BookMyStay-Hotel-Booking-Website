const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.log("❌ Error Connecting to MongoDB");
    console.log(err.message);

    process.exit(1);
  }
}

module.exports = connectToDB;
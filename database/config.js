const mongoose = require("mongoose");
require("dotenv").config();

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DC_CNN);

    console.log("DB online");
  } catch (error) {
    console.log(error);
    throw new Error("Error init database");
  }
};

module.exports = { dbConnection };

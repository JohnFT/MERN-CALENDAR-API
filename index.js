const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/auth");
const eventsRouter = require("./routes/events");
const { dbConnection } = require("./database/config");

const { PORT } = process.env;

// Instance Services Express
const app = express();

// database
dbConnection();

// CORS
app.use(cors());

// Public
app.use(express.static("public"));

app.use(express.json());

//Rutas
app.use("/api/auth", authRouter);
app.use("/api/events", eventsRouter);

app.listen(PORT, () => {
  console.log(`Server runing on port ${PORT}`);
});

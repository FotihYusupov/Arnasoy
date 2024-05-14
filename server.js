const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/router");

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log("db error", err.message));

app.use(cors());

app.use(router);

app.use('/uploads', express.static('uploads'))

app.listen(process.env.PORT || 5001, () => console.log("server is run"));

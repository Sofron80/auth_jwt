require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./router");
const errorMiddleware = require("./middlewares/error-middleware");

const PORT = process.env.PORT || 7000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api", router);
app.use(errorMiddleware);

app.get("/", (req, res) => {
  return res.send("Главная страница");
});

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () =>
      console.log(`Server starten from  http://localhost:${PORT}`)
    );
  } catch (e) {
    console.log(e);
  }
};

start();

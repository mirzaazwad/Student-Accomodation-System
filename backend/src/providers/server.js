const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const { authMiddleware } = require("../middlewares/auth.middleware");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5174",
    ],
  })
);

app.use(authMiddleware);
app.use("/upload", express.static(path.resolve(__dirname, "../../upload")));

const apartmentRoute = require("../routes/appartment.route");
const auth = require("../routes/auth.route");

app.use("/apartment", apartmentRoute);
app.use("/auth", auth);
app.use(express.json());

app.get("/health", (req, res) => {
  res.send("Backend is running");
});

module.exports = {
  app,
};

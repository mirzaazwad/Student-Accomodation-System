const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const { authMiddleware } = require("../middlewares/auth.middleware");
const logMiddleware = require("../middlewares/log.middleware");
app.use(bodyParser.json());
app.use(express.json());
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

app.use(logMiddleware);
app.use(authMiddleware);
app.use("/upload", express.static(path.resolve(__dirname, "../../upload")));

const apartmentRoute = require("../routes/appartment.route");
const auth = require("../routes/auth.route");
const userRoute = require("../routes/user.route");
const messageRoute = require("../routes/message.route");
const requestRoute = require("../routes/request.route");
const transactionRoute = require("../routes/transaction.route");

app.use("/apartment", apartmentRoute);
app.use("/auth", auth);
app.use("/user", userRoute);
app.use("/message", messageRoute);
app.use("/request", requestRoute);
app.use("/transaction", transactionRoute);

app.get("/health", (req, res) => {
  res.send("Backend is running");
});

module.exports = {
  app,
};

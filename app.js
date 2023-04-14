const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const fontRouter = require("./router/font");
const userRouter = require("./router/user");

// App setup
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "Content-Type",
    "Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

// Database Connection
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Mongodb is connected");
  }
);

// Routes
app.get("/", (req, res) => {
  res.sendFile("index.html");
});
app.use("/api/font", fontRouter);
app.use("/api/user", userRouter);

// Connection
app.listen(PORT, (req, res) => {
  console.log(`Server connected to port: ${PORT}`);
});

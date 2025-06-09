const express = require("express");
const connectDB = require("./config/db");
const urlRoutes = require("./routes/urlRoutes");
const userRoutes = require("./routes/userRoutes");
const { redirectToOriginalUrl } = require("./controllers/urlController");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
require("dotenv").config();

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_FILE,
    credentials: true,
  })
);

const PORT = process.env.PORT || 8000;

app.use("/api/url", urlRoutes);
app.use("/api/auth", userRoutes);

app.get("/:shortId", redirectToOriginalUrl);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on ${process.env.BASE_URL}${PORT}`);
});

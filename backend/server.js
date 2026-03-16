const path = require("path");

require("dotenv").config({
 path: path.join(__dirname, ".env")
});

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
 cors({
  origin: allowedOrigin
 })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
 res.json({
  ok: true
 });
});

app.use("/api/image", require("./routes/imageRoutes"));
app.use("/api/video", require("./routes/videoRoutes"));

app.use((error, _req, res, _next) => {
 console.error(error);

 const statusCode = error.status || 400;

 res.status(statusCode).json({
  message: error.message || "Request failed"
 });
});

app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});
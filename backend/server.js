const path = require("path");

require("dotenv").config({
 path: path.join(__dirname, ".env")
});

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration for both development and production
// const corsOptions = {
//  origin: true, // Allow all origins
//  credentials: true,
//  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//  allowedHeaders: ['Content-Type', 'Authorization']
// };

app.use(cors({
  origin: true,
  credentials: true
})); 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint
app.get("/api/health", (_req, res) => {
 res.json({
  ok: true,
  timestamp: new Date().toISOString(),
  service: "AI Product Generator Backend"
 });
});

// API Routes
app.use("/api/image", require("./routes/imageRoutes"));
app.use("/api/video", require("./routes/videoRoutes"));

// 404 Handler
app.use((req, res) => {
 res.status(404).json({
  message: `Route ${req.method} ${req.path} not found`
 });
});

// Error Handler (must be last)
app.use((error, _req, res, _next) => {
 console.error("❌ Error:", error);

 const statusCode = error.status || error.statusCode || 500;
 const message = error.message || "Internal Server Error";

 res.status(statusCode).json({
  success: false,
  message: message,
  ...(process.env.NODE_ENV === 'development' && { error: error.stack })
 });
});

// Start Server
const server = app.listen(PORT, "0.0.0.0", () => {
 console.log(`
╔════════════════════════════════════════════════╗
║  ✅ Server Running Successfully                │
║  🔗 URL: http://localhost:${PORT}              │
║  🏥 Health: http://localhost:${PORT}/api/health│
║  🌍 CORS: Enabled for all origins             │
╚════════════════════════════════════════════════╝
 `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
 console.log('📌 SIGTERM received, shutting down gracefully...');
 server.close(() => {
  console.log('✅ Server closed');
  process.exit(0);
 });
});

process.on('SIGINT', () => {
 console.log('📌 SIGINT received, shutting down gracefully...');
 server.close(() => {
  console.log('✅ Server closed');
  process.exit(0);
 });
});

// Handle unhandled errors
process.on('uncaughtException', (error) => {
 console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
 console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

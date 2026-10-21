const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables before any other module
dotenv.config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const healthRecordRoutes = require("./routes/healthRecordRoutes");
const vitalRoutes = require("./routes/vitalRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Patient Monitoring System API is running",
  });
});

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", healthRecordRoutes);
app.use("/api/vitals", vitalRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`,
  });
});

// Centralized error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server: Connect to Database FIRST, then listen for HTTP requests
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authroutes");
const userRoutes = require("./routes/userRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const interviewRoutes = require("./routes/InterviewRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

// ==========================================
// CORS Configuration
// ==========================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://peer-prep.vercel.app",
];

const isAllowedVercelOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  return /^https:\/\/peer-prep-[a-z0-9-]+-sg0176734-svgs-projects\.vercel\.app$/i.test(
    origin
  );
};

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        isAllowedVercelOrigin(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ==========================================
// Home
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PeerPrep API is running 🚀",
  });
});

// ==========================================
// API Routes
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/matching", matchingRoutes);

app.use("/api/interview", interviewRoutes);

app.use("/api/feedback", feedbackRoutes);

// ==========================================
// Start Server
// ==========================================

app.listen(PORT, () => {
  console.log(
    `PeerPrep server running on http://localhost:${PORT}`
  );
});
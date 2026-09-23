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

app.use(cors());
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
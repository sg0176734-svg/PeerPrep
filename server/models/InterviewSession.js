const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewRequest",
      required: true,
      unique: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    interviewType: {
      type: String,
      enum: [
        "Technical",
        "HR",
        "Coding",
        "Communication",
        "Resume",
        "Aptitude",
      ],
      required: true,
    },

    topic: {
      type: String,
      trim: true,
      default: "",
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      default: 30,
      min: 10,
      max: 180,
    },

    meetingLink: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Scheduled", "Ongoing", "Completed", "Cancelled"],
      default: "Scheduled",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
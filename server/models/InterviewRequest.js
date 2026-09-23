const mongoose = require("mongoose");

const interviewRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
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

    proposedDate: {
      type: Date,
      required: true,
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "InterviewRequest",
  interviewRequestSchema
);
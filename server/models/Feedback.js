const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      required: true,
    },

    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    overallRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    technicalKnowledge: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    communication: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    problemSolving: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index(
  { interview: 1, fromUser: 1 },
  { unique: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
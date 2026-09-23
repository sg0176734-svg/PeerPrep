const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    college: {
      type: String,
      trim: true,
      default: "",
    },

    course: {
      type: String,
      trim: true,
      default: "",
    },

    year: {
      type: String,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Other"],
      default: "Other",
    },

    skills: {
      type: [String],
      default: [],
    },

    interviewTopics: {
      type: [String],
      default: [],
    },

    interviewTypes: {
      type: [String],
      enum: [
        "Technical",
        "HR",
        "Coding",
        "Communication",
        "Resume",
        "Aptitude",
      ],
      default: [],
    },

    preferredRole: {
      type: String,
      enum: ["Candidate", "Interviewer", "Both"],
      default: "Both",
    },

    availability: {
      type: String,
      default: "",
      trim: true,
    },

    isAvailableForMock: {
      type: Boolean,
      default: true,
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const User = require("../models/User");

const router = express.Router();

// ===============================
// GET USER PROFILE
// ===============================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ===============================
// UPDATE USER PROFILE
// ===============================
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const {
      fullName,
      college,
      course,
      year,
      skills,
      interviewTopics,
      interviewTypes,
      preferredRole,
      availability,
      isAvailableForMock,
      bio,
      profileImage,
    } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update only fields that are provided
    if (fullName !== undefined) user.fullName = fullName;
    if (college !== undefined) user.college = college;
    if (course !== undefined) user.course = course;
    if (year !== undefined) user.year = year;
    if (skills !== undefined) user.skills = skills;
    if (interviewTopics !== undefined) {
      user.interviewTopics = interviewTopics;
    }
    if (interviewTypes !== undefined) {
      user.interviewTypes = interviewTypes;
    }
    if (preferredRole !== undefined) {
      user.preferredRole = preferredRole;
    }
    if (availability !== undefined) {
      user.availability = availability;
    }
    if (isAvailableForMock !== undefined) {
      user.isAvailableForMock = isAvailableForMock;
    }
    if (bio !== undefined) user.bio = bio;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    const updatedUser = await User.findById(req.user.userId).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
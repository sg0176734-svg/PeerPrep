const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const User = require("../models/User");

const router = express.Router();

// ==========================================
// FIND MATCHING PEERS
// ==========================================
router.get("/peers", authMiddleware, async (req, res) => {
  try {
    // Logged-in user ko find karo
    const currentUser = await User.findById(req.user.userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Matching ke liye current user's data
    const currentSkills = currentUser.skills || [];
    const currentInterviewTypes = currentUser.interviewTypes || [];
    const currentTopics = currentUser.interviewTopics || [];

    // Current user ko exclude karke active students find karo
    const peers = await User.find({
      _id: { $ne: currentUser._id },
      isActive: true,
      isAvailableForMock: true,
    }).select("-password");

    // Har peer ka matching score calculate karo
    const matchedPeers = peers.map((peer) => {
      let score = 0;
      const matchedSkills = [];
      const matchedInterviewTypes = [];
      const matchedTopics = [];

      // ===============================
      // SKILLS MATCH
      // ===============================
      peer.skills.forEach((skill) => {
        const skillMatch = currentSkills.some(
          (currentSkill) =>
            currentSkill.toLowerCase().trim() ===
            skill.toLowerCase().trim()
        );

        if (skillMatch) {
          score += 30;
          matchedSkills.push(skill);
        }
      });

      // ===============================
      // INTERVIEW TYPE MATCH
      // ===============================
      peer.interviewTypes.forEach((type) => {
        if (currentInterviewTypes.includes(type)) {
          score += 20;
          matchedInterviewTypes.push(type);
        }
      });

      // ===============================
      // INTERVIEW TOPICS MATCH
      // ===============================
      peer.interviewTopics.forEach((topic) => {
        const topicMatch = currentTopics.some(
          (currentTopic) =>
            currentTopic.toLowerCase().trim() ===
            topic.toLowerCase().trim()
        );

        if (topicMatch) {
          score += 15;
          matchedTopics.push(topic);
        }
      });

      // ===============================
      // ROLE MATCH
      // ===============================
      if (
        currentUser.preferredRole === "Both" ||
        peer.preferredRole === "Both"
      ) {
        score += 10;
      } else if (
        (currentUser.preferredRole === "Candidate" &&
          peer.preferredRole === "Interviewer") ||
        (currentUser.preferredRole === "Interviewer" &&
          peer.preferredRole === "Candidate")
      ) {
        score += 25;
      }

      // ===============================
      // AVAILABILITY MATCH
      // ===============================
      if (
        currentUser.availability &&
        peer.availability &&
        currentUser.availability.toLowerCase().trim() ===
          peer.availability.toLowerCase().trim()
      ) {
        score += 10;
      }

      return {
        id: peer._id,
        fullName: peer.fullName,
        email: peer.email,
        college: peer.college,
        course: peer.course,
        year: peer.year,
        skills: peer.skills,
        interviewTopics: peer.interviewTopics,
        interviewTypes: peer.interviewTypes,
        preferredRole: peer.preferredRole,
        availability: peer.availability,
        bio: peer.bio,
        profileImage: peer.profileImage,
        matchScore: score,
        matchedSkills,
        matchedInterviewTypes,
        matchedTopics,
      };
    });

    // Highest matching score first
    matchedPeers.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      message: "Matching peers fetched successfully",
      count: matchedPeers.length,
      peers: matchedPeers,
    });
  } catch (error) {
    console.error("Matching error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while finding matching peers",
    });
  }
});

module.exports = router;
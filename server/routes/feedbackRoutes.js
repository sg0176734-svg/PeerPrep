const express = require("express");

const authMiddleware = require("../middleware/authmiddleware");
const Feedback = require("../models/Feedback");
const InterviewSession = require("../models/InterviewSession");

const router = express.Router();


// ==========================================
// POST /api/feedback
// Submit feedback after completed interview
// ==========================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      interviewId,
      overallRating,
      technicalKnowledge,
      communication,
      problemSolving,
      comment,
    } = req.body;

    if (
      !interviewId ||
      !overallRating ||
      !technicalKnowledge ||
      !communication ||
      !problemSolving
    ) {
      return res.status(400).json({
        success: false,
        message: "All rating fields are required",
      });
    }

    const interview = await InterviewSession.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    // Feedback can only be submitted after interview completion
    if (interview.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message:
          "Feedback can only be submitted after completing the interview",
      });
    }

    const userId = req.user.userId;

    // Check whether user participated in this interview
    const isParticipant =
      interview.candidate.toString() === userId ||
      interview.interviewer.toString() === userId;

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this interview",
      });
    }

    // Find the other participant
    let toUser;

    if (interview.candidate.toString() === userId) {
      toUser = interview.interviewer;
    } else {
      toUser = interview.candidate;
    }

    // Prevent duplicate feedback
    const existingFeedback = await Feedback.findOne({
      interview: interview._id,
      fromUser: userId,
    });

    if (existingFeedback) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted feedback for this interview",
      });
    }

    const feedback = await Feedback.create({
      interview: interview._id,
      fromUser: userId,
      toUser,
      overallRating: Number(overallRating),
      technicalKnowledge: Number(technicalKnowledge),
      communication: Number(communication),
      problemSolving: Number(problemSolving),
      comment: comment || "",
    });

    const populatedFeedback = await Feedback.findById(
      feedback._id
    )
      .populate("fromUser", "fullName email college course year")
      .populate("toUser", "fullName email college course year")
      .populate(
        "interview",
        "interviewType topic scheduledAt duration"
      );

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback: populatedFeedback,
    });
  } catch (error) {
    console.error("Submit feedback error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while submitting feedback",
    });
  }
});


// ==========================================
// GET /api/feedback/my-feedback
// Get feedback received by logged-in user
// ==========================================

router.get("/my-feedback", authMiddleware, async (req, res) => {
  try {
    const feedback = await Feedback.find({
      toUser: req.user.userId,
    })
      .populate(
        "fromUser",
        "fullName email college course year"
      )
      .populate(
        "interview",
        "interviewType topic scheduledAt duration"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedback.length,
      feedback,
    });
  } catch (error) {
    console.error("Get my feedback error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching feedback",
    });
  }
});


// ==========================================
// GET /api/feedback/given
// Get feedback submitted by logged-in user
// ==========================================

router.get("/given", authMiddleware, async (req, res) => {
  try {
    const feedback = await Feedback.find({
      fromUser: req.user.userId,
    })
      .populate(
        "toUser",
        "fullName email college course year"
      )
      .populate(
        "interview",
        "interviewType topic scheduledAt duration"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedback.length,
      feedback,
    });
  } catch (error) {
    console.error("Get given feedback error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching given feedback",
    });
  }
});


// ==========================================
// GET /api/feedback/interview/:interviewId
// Get feedback for a particular interview
// ==========================================

router.get(
  "/interview/:interviewId",
  authMiddleware,
  async (req, res) => {
    try {
      const { interviewId } = req.params;

      const interview = await InterviewSession.findById(
        interviewId
      );

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview session not found",
        });
      }

      const userId = req.user.userId;

      const isParticipant =
        interview.candidate.toString() === userId ||
        interview.interviewer.toString() === userId;

      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message: "You are not part of this interview",
        });
      }

      const feedback = await Feedback.find({
        interview: interviewId,
      })
        .populate(
          "fromUser",
          "fullName email college course year"
        )
        .populate(
          "toUser",
          "fullName email college course year"
        );

      res.status(200).json({
        success: true,
        count: feedback.length,
        feedback,
      });
    } catch (error) {
      console.error(
        "Get interview feedback error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Server error while fetching interview feedback",
      });
    }
  }
);


module.exports = router;
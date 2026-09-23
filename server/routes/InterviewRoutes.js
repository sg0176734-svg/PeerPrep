const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const User = require("../models/User");
const InterviewRequest = require("../models/InterviewRequest");
const InterviewSession = require("../models/InterviewSession");

const router = express.Router();

// ==========================================
// SEND INTERVIEW REQUEST
// ==========================================
router.post("/request", authMiddleware, async (req, res) => {
  try {
    const {
      receiverId,
      interviewType,
      topic,
      proposedDate,
      message,
    } = req.body;

    if (!receiverId || !interviewType || !proposedDate) {
      return res.status(400).json({
        success: false,
        message:
          "Receiver, interview type and proposed date are required",
      });
    }

    const sender = await User.findById(req.user.userId);

    if (!sender) {
      return res.status(404).json({
        success: false,
        message: "Sender not found",
      });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    if (sender._id.toString() === receiver._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot send an interview request to yourself",
      });
    }

    if (!receiver.isAvailableForMock) {
      return res.status(400).json({
        success: false,
        message:
          "This student is currently unavailable for mock interviews",
      });
    }

    const existingRequest = await InterviewRequest.findOne({
      sender: sender._id,
      receiver: receiver._id,
      status: "Pending",
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "You already have a pending request with this student",
      });
    }

    const interviewRequest = await InterviewRequest.create({
      sender: sender._id,
      receiver: receiver._id,
      interviewType,
      topic: topic || "",
      proposedDate,
      message: message || "",
    });

    const populatedRequest = await InterviewRequest.findById(
      interviewRequest._id
    )
      .populate("sender", "fullName email college course year")
      .populate("receiver", "fullName email college course year");

    res.status(201).json({
      success: true,
      message: "Interview request sent successfully",
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Send interview request error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while sending interview request",
    });
  }
});

// ==========================================
// GET RECEIVED REQUESTS
// ==========================================
router.get("/received", authMiddleware, async (req, res) => {
  try {
    const requests = await InterviewRequest.find({
      receiver: req.user.userId,
    })
      .populate("sender", "fullName email college course year skills bio")
      .populate("receiver", "fullName email college course year")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Received interview requests fetched successfully",
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get received requests error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching received requests",
    });
  }
});

// ==========================================
// ACCEPT REQUEST + CREATE SESSION
// ==========================================
router.put("/request/:requestId/accept", authMiddleware, async (req, res) => {
  try {
    const { requestId } = req.params;

    const {
      meetingLink = "",
      duration = 30,
    } = req.body;

    const request = await InterviewRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Interview request not found",
      });
    }

    if (request.receiver.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to accept this request",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status.toLowerCase()}`,
      });
    }

    // Receiver becomes interviewer
    // Sender becomes candidate
    const session = await InterviewSession.create({
      request: request._id,
      candidate: request.sender,
      interviewer: request.receiver,
      interviewType: request.interviewType,
      topic: request.topic,
      scheduledAt: request.proposedDate,
      duration: Number(duration),
      meetingLink,
      status: "Scheduled",
    });

    request.status = "Accepted";

    await request.save();

    const populatedSession = await InterviewSession.findById(session._id)
      .populate("candidate", "fullName email college course year")
      .populate("interviewer", "fullName email college course year");

    res.status(200).json({
      success: true,
      message: "Interview request accepted and session scheduled",
      session: populatedSession,
    });
  } catch (error) {
    console.error("Accept request error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while accepting request",
    });
  }
});

// ==========================================
// REJECT REQUEST
// ==========================================
router.put("/request/:requestId/reject", authMiddleware, async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await InterviewRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Interview request not found",
      });
    }

    if (request.receiver.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to reject this request",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status.toLowerCase()}`,
      });
    }

    request.status = "Rejected";

    await request.save();

    res.status(200).json({
      success: true,
      message: "Interview request rejected successfully",
      request,
    });
  } catch (error) {
    console.error("Reject request error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while rejecting request",
    });
  }
});

// ==========================================
// GET MY INTERVIEW SESSIONS
// ==========================================
router.get("/my-interviews", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const sessions = await InterviewSession.find({
      $or: [
        { candidate: userId },
        { interviewer: userId },
      ],
    })
      .populate("candidate", "fullName email college course year")
      .populate("interviewer", "fullName email college course year")
      .sort({ scheduledAt: 1 });

    res.status(200).json({
      success: true,
      message: "My interviews fetched successfully",
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error("Get my interviews error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching interviews",
    });
  }
});

// ==========================================
// COMPLETE INTERVIEW
// ==========================================
router.put(
  "/:sessionId/complete",
  authMiddleware,
  async (req, res) => {
    try {
      const { sessionId } = req.params;

      const session = await InterviewSession.findById(sessionId);

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Interview session not found",
        });
      }

      const userId = req.user.userId;

      if (
        session.candidate.toString() !== userId &&
        session.interviewer.toString() !== userId
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not part of this interview",
        });
      }

      if (session.status === "Completed") {
        return res.status(400).json({
          success: false,
          message: "Interview is already completed",
        });
      }

      session.status = "Completed";

      if (req.body.notes !== undefined) {
        session.notes = req.body.notes;
      }

      await session.save();

      res.status(200).json({
        success: true,
        message: "Interview completed successfully",
        session,
      });
    } catch (error) {
      console.error("Complete interview error:", error);

      res.status(500).json({
        success: false,
        message: "Server error while completing interview",
      });
    }
  }
);

module.exports = router;
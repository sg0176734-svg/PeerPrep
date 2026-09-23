import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Feedback() {
  const location = useLocation();
  const navigate = useNavigate();

  const interview = location.state?.interview;

  const [formData, setFormData] = useState({
    overallRating: 5,
    technicalKnowledge: 5,
    communication: 5,
    problemSolving: 5,
    comment: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const currentUser = JSON.parse(
    localStorage.getItem("peerprepUser") || "{}"
  );

  if (!interview) {
    return (
      <div className="modern-dashboard">
        <aside className="dashboard-sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">P</div>

            <div>
              <h2>PeerPrep</h2>
              <span>Students Helping Students</span>
            </div>
          </div>

          <div className="sidebar-menu">
            <p className="menu-title">MAIN MENU</p>

            <button
              className="sidebar-link"
              onClick={() => navigate("/dashboard")}
            >
              <span>▦</span>
              Dashboard
            </button>

            <button
              className="sidebar-link"
              onClick={() => navigate("/peers")}
            >
              <span>👥</span>
              Find Peers
            </button>

            <button
              className="sidebar-link"
              onClick={() => navigate("/requests")}
            >
              <span>✉</span>
              Interview Requests
            </button>

            <button
              className="sidebar-link"
              onClick={() => navigate("/interviews")}
            >
              <span>▣</span>
              My Interviews
            </button>

            <p className="menu-title second-menu-title">
              PERSONAL
            </p>

            <button className="sidebar-link active">
              <span>★</span>
              My Feedback
            </button>

            <button
              className="sidebar-link"
              onClick={() => navigate("/profile")}
            >
              <span>◉</span>
              My Profile
            </button>
          </div>

          <div className="sidebar-bottom">
            <div className="sidebar-help">
              <div className="help-icon">?</div>

              <div>
                <strong>Need Help?</strong>
                <span>We're here for you.</span>
              </div>
            </div>

            <button
              className="sidebar-logout"
              onClick={() => {
                localStorage.removeItem("peerprepToken");
                localStorage.removeItem("peerprepUser");
                navigate("/login");
              }}
            >
              <span>↪</span>
              Logout
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <div className="feedback-empty-modern">
            <div className="modern-empty-icon">⭐</div>

            <h2>Interview Not Selected</h2>

            <p>
              Please select a completed interview before
              giving feedback.
            </p>

            <button
              className="primary-dashboard-button"
              onClick={() => navigate("/interviews")}
            >
              Back to My Interviews
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("peerprepToken");

      const response = await axios.post(
        "http://localhost:5000/api/feedback",
        {
          interviewId: interview._id,
          overallRating: Number(formData.overallRating),
          technicalKnowledge: Number(
            formData.technicalKnowledge
          ),
          communication: Number(
            formData.communication
          ),
          problemSolving: Number(
            formData.problemSolving
          ),
          comment: formData.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setMessage("Feedback submitted successfully!");

        setTimeout(() => {
          navigate("/interviews");
        }, 1500);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to submit feedback."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-dashboard">
      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">P</div>

          <div>
            <h2>PeerPrep</h2>
            <span>Students Helping Students</span>
          </div>
        </div>

        <div className="sidebar-menu">
          <p className="menu-title">MAIN MENU</p>

          <button
            className="sidebar-link"
            onClick={() => navigate("/dashboard")}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/peers")}
          >
            <span>👥</span>
            Find Peers
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/requests")}
          >
            <span>✉</span>
            Interview Requests
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/interviews")}
          >
            <span>▣</span>
            My Interviews
          </button>

          <p className="menu-title second-menu-title">
            PERSONAL
          </p>

          <button className="sidebar-link active">
            <span>★</span>
            My Feedback
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/profile")}
          >
            <span>◉</span>
            My Profile
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <div className="help-icon">?</div>

            <div>
              <strong>Need Help?</strong>
              <span>We're here for you.</span>
            </div>
          </div>

          <button
            className="sidebar-logout"
            onClick={() => {
              localStorage.removeItem("peerprepToken");
              localStorage.removeItem("peerprepUser");
              navigate("/login");
            }}
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <p className="topbar-small">PEERPREP</p>

            <h1>My Feedback</h1>
          </div>

          <div className="top-profile">
            <div className="top-avatar">
              {currentUser.fullName
                ?.charAt(0)
                .toUpperCase() || "S"}
            </div>

            <div className="top-profile-info">
              <strong>
                {currentUser.fullName || "Student"}
              </strong>

              <span>Student</span>
            </div>

            <span className="profile-arrow">⌄</span>
          </div>
        </header>

        {/* PAGE HEADER */}

        <section className="feedback-modern-header">
          <div>
            <p className="welcome-label">
              POST-INTERVIEW FEEDBACK
            </p>

            <h2>Help Your Peer Improve</h2>

            <p>
              Share honest and constructive feedback about
              your mock interview experience.
            </p>
          </div>
        </section>

        {/* INTERVIEW SUMMARY */}

        <section className="feedback-interview-card">
          <div className="feedback-peer-icon">★</div>

          <div className="feedback-interview-main">
            <span>INTERVIEW DETAILS</span>

            <h3>
              {interview.interviewType} Interview
            </h3>

            <p>
              {interview.topic ||
                "General Practice"}
            </p>
          </div>

          <div className="feedback-interview-meta">
            <div>
              <span>DATE & TIME</span>

              <strong>
                {new Date(
                  interview.scheduledAt
                ).toLocaleString()}
              </strong>
            </div>
          </div>
        </section>

        {/* FEEDBACK FORM */}

        <form
          className="modern-feedback-card"
          onSubmit={handleSubmit}
        >
          <div className="modern-feedback-heading">
            <span className="section-label">
              PERFORMANCE REVIEW
            </span>

            <h2>Rate Your Peer</h2>

            <p>
              Select a rating from 1 to 5 for each area.
            </p>
          </div>

          <div className="modern-rating-grid">
            <div className="modern-rating-box">
              <label>Overall Performance</label>

              <select
                name="overallRating"
                value={formData.overallRating}
                onChange={handleChange}
              >
                <option value="5">
                  5 - Excellent
                </option>

                <option value="4">
                  4 - Very Good
                </option>

                <option value="3">
                  3 - Good
                </option>

                <option value="2">
                  2 - Needs Improvement
                </option>

                <option value="1">
                  1 - Poor
                </option>
              </select>
            </div>

            <div className="modern-rating-box">
              <label>Technical Knowledge</label>

              <select
                name="technicalKnowledge"
                value={formData.technicalKnowledge}
                onChange={handleChange}
              >
                <option value="5">
                  5 - Excellent
                </option>

                <option value="4">
                  4 - Very Good
                </option>

                <option value="3">
                  3 - Good
                </option>

                <option value="2">
                  2 - Needs Improvement
                </option>

                <option value="1">
                  1 - Poor
                </option>
              </select>
            </div>

            <div className="modern-rating-box">
              <label>Communication</label>

              <select
                name="communication"
                value={formData.communication}
                onChange={handleChange}
              >
                <option value="5">
                  5 - Excellent
                </option>

                <option value="4">
                  4 - Very Good
                </option>

                <option value="3">
                  3 - Good
                </option>

                <option value="2">
                  2 - Needs Improvement
                </option>

                <option value="1">
                  1 - Poor
                </option>
              </select>
            </div>

            <div className="modern-rating-box">
              <label>Problem Solving</label>

              <select
                name="problemSolving"
                value={formData.problemSolving}
                onChange={handleChange}
              >
                <option value="5">
                  5 - Excellent
                </option>

                <option value="4">
                  4 - Very Good
                </option>

                <option value="3">
                  3 - Good
                </option>

                <option value="2">
                  2 - Needs Improvement
                </option>

                <option value="1">
                  1 - Poor
                </option>
              </select>
            </div>
          </div>

          {/* COMMENT */}

          <div className="modern-comment-section">
            <div>
              <span className="section-label">
                WRITTEN FEEDBACK
              </span>

              <h2>Your Comments</h2>

              <p>
                Share specific points that can help your
                peer improve.
              </p>
            </div>

            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="6"
              placeholder="Example: Good technical knowledge. Could improve explanation of concepts..."
            />
          </div>

          {message && (
            <div
              className={
                success
                  ? "success-message"
                  : "error-message"
              }
            >
              {message}
            </div>
          )}

          {/* ACTIONS */}

          <div className="modern-feedback-actions">
            <button
              type="button"
              className="modern-cancel-button"
              onClick={() => navigate("/interviews")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="modern-submit-feedback"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Feedback →"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Feedback;
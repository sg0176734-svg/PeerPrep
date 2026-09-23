import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FeedbackHistory() {
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("peerprepToken");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/feedback/my-feedback",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFeedback(response.data.feedback || []);
      } catch (error) {
        console.error("Feedback fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchFeedback();
    } else {
      setLoading(false);
    }
  }, [token]);

  const getAverage = (item) => {
    const total =
      Number(item.overallRating || 0) +
      Number(item.technicalKnowledge || 0) +
      Number(item.communication || 0) +
      Number(item.problemSolving || 0);

    return (total / 4).toFixed(1);
  };

  const handleLogout = () => {
    localStorage.removeItem("peerprepToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="modern-dashboard">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">🤝</div>
            <div>
              <h2>PeerPrep</h2>
              <p>Students Helping Students</p>
            </div>
          </div>

          <nav className="sidebar-menu">
            <p className="menu-title">MAIN MENU</p>

            <button
              className="sidebar-link"
              onClick={() => navigate("/dashboard")}
            >
              <span>🏠</span>
              Dashboard
            </button>

            <button
              className="sidebar-link"
              onClick={() => navigate("/peers")}
            >
              <span>🔎</span>
              Find Peers
            </button>

            <button
              className="sidebar-link"
              onClick={() => navigate("/requests")}
            >
              <span>📩</span>
              Interview Requests
            </button>

            <button
              className="sidebar-link"
              onClick={() => navigate("/interviews")}
            >
              <span>🎤</span>
              My Interviews
            </button>

            <button
              className="sidebar-link active"
              onClick={() => navigate("/feedback-history")}
            >
              <span>⭐</span>
              My Feedback
            </button>

            <p className="menu-title second-menu-title">ACCOUNT</p>

            <button
              className="sidebar-link"
              onClick={() => navigate("/profile")}
            >
              <span>👤</span>
              My Profile
            </button>
          </nav>

          <div className="sidebar-bottom">
            <button
              className="sidebar-help"
              onClick={() =>
                alert(
                  "Need Help?\n\nYou can use Find Peers to connect with students and schedule mock interviews."
                )
              }
            >
              <span className="help-icon">💡</span>

              <div>
                <strong>Need Help?</strong>
                <small>We're here to help</small>
              </div>
            </button>

            <button className="sidebar-logout" onClick={handleLogout}>
              <span>🚪</span>
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="dashboard-main">
          <div className="dashboard-topbar">
            <div>
              <span className="topbar-small">FEEDBACK</span>
              <h2>My Feedback</h2>
            </div>
          </div>

          <div className="page-container">
            <h2>Loading feedback...</h2>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      {/* ================= SIDEBAR ================= */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">🤝</div>

          <div>
            <h2>PeerPrep</h2>
            <p>Students Helping Students</p>
          </div>
        </div>

        <nav className="sidebar-menu">
          <p className="menu-title">MAIN MENU</p>

          <button
            className="sidebar-link"
            onClick={() => navigate("/dashboard")}
          >
            <span>🏠</span>
            Dashboard
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/peers")}
          >
            <span>🔎</span>
            Find Peers
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/requests")}
          >
            <span>📩</span>
            Interview Requests
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/interviews")}
          >
            <span>🎤</span>
            My Interviews
          </button>

          <button
            className="sidebar-link active"
            onClick={() => navigate("/feedback-history")}
          >
            <span>⭐</span>
            My Feedback
          </button>

          <p className="menu-title second-menu-title">ACCOUNT</p>

          <button
            className="sidebar-link"
            onClick={() => navigate("/profile")}
          >
            <span>👤</span>
            My Profile
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            className="sidebar-help"
            onClick={() =>
              alert(
                "Need Help?\n\nYou can use Find Peers to connect with students and schedule mock interviews."
              )
            }
          >
            <span className="help-icon">💡</span>

            <div>
              <strong>Need Help?</strong>
              <small>We're here to help</small>
            </div>
          </button>

          <button className="sidebar-logout" onClick={handleLogout}>
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="dashboard-main">
        {/* Topbar */}
        <div className="dashboard-topbar">
          <div>
            <span className="topbar-small">PEERPREP</span>
            <h2>My Feedback</h2>
          </div>

          <div className="top-profile">
            <div className="top-avatar">⭐</div>

            <div className="top-profile-info">
              <strong>My Feedback</strong>
              <span>Interview Performance</span>
            </div>

            <span className="profile-arrow">⌄</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="page-container">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1>⭐ My Feedback</h1>

              <p>
                See what other students said about your mock interviews.
              </p>
            </div>

            <button
              className="secondary-btn"
              onClick={() => navigate("/dashboard")}
            >
              ← Dashboard
            </button>
          </div>

          {/* Empty State */}
          {feedback.length === 0 ? (
            <div className="empty-card">
              <div
                style={{
                  fontSize: "52px",
                  marginBottom: "12px",
                }}
              >
                ⭐
              </div>

              <h2>No feedback yet</h2>

              <p>
                Complete mock interviews and ask your peers for feedback.
              </p>

              <button
                className="primary-btn"
                onClick={() => navigate("/peers")}
              >
                🔎 Find a Peer
              </button>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div
                className="dashboard-stats"
                style={{
                  marginBottom: "25px",
                }}
              >
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>

                  <div>
                    <span>Total Feedback</span>
                    <strong>{feedback.length}</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🏆</div>

                  <div>
                    <span>Latest Rating</span>
                    <strong>
                      {feedback[0]?.overallRating || 0}/5
                    </strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📊</div>

                  <div>
                    <span>Average Score</span>
                    <strong>
                      {(
                        feedback.reduce(
                          (sum, item) =>
                            sum + Number(item.overallRating || 0),
                          0
                        ) / feedback.length
                      ).toFixed(1)}
                      /5
                    </strong>
                  </div>
                </div>
              </div>

              {/* Feedback List */}
              <div className="feedback-list">
                {feedback.map((item) => (
                  <div className="feedback-card" key={item._id}>
                    {/* Top */}
                    <div className="feedback-top">
                      <div>
                        <h2>
                          {item.fromUser?.fullName || "Peer Student"}
                        </h2>

                        <p>
                          {item.interview?.interviewType ||
                            "Mock Interview"}

                          {item.interview?.topic
                            ? ` • ${item.interview.topic}`
                            : ""}
                        </p>
                      </div>

                      <div className="overall-rating">
                        ⭐ {item.overallRating}/5
                      </div>
                    </div>

                    {/* Ratings */}
                    <div className="rating-grid">
                      <div>
                        <span>Technical Knowledge</span>

                        <strong>
                          {item.technicalKnowledge}/5
                        </strong>
                      </div>

                      <div>
                        <span>Communication</span>

                        <strong>
                          {item.communication}/5
                        </strong>
                      </div>

                      <div>
                        <span>Problem Solving</span>

                        <strong>
                          {item.problemSolving}/5
                        </strong>
                      </div>

                      <div>
                        <span>Average</span>

                        <strong>
                          {getAverage(item)}/5
                        </strong>
                      </div>
                    </div>

                    {/* Comment */}
                    {item.comment && (
                      <div className="feedback-comment">
                        <strong>💬 Comment</strong>

                        <p>{item.comment}</p>
                      </div>
                    )}

                    {/* Date */}
                    <small>
                      Submitted on{" "}
                      {item.createdAt
                        ? new Date(
                            item.createdAt
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </small>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default FeedbackHistory;
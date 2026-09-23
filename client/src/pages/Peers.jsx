import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Peers() {
  const navigate = useNavigate();

  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const currentUser = JSON.parse(
    localStorage.getItem("peerprepUser") || "{}"
  );

  useEffect(() => {
    const fetchPeers = async () => {
      const token = localStorage.getItem("peerprepToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "https://peerprep-backend-7qvh.onrender.com/api/matching/peers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setPeers(response.data.peers || []);
        }
      } catch (error) {
        console.error("Fetch peers error:", error);

        setMessage(
          error.response?.data?.message ||
            "Unable to load peers."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPeers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("peerprepToken");
    localStorage.removeItem("peerprepUser");
    navigate("/login");
  };

  const handleRequest = (peer) => {
    navigate("/request-interview", {
      state: {
        peer,
      },
    });
  };

  return (
    <div className="modern-dashboard">
      {/* ================= SIDEBAR ================= */}

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
            <span>🏠</span>
            Dashboard
          </button>

          <button className="sidebar-link active">
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

          {/* FIXED: My Feedback */}
          <button
            className="sidebar-link"
            onClick={() => navigate("/feedback-history")}
          >
            <span>⭐</span>
            My Feedback
          </button>

          <p className="menu-title second-menu-title">
            ACCOUNT
          </p>

          <button
            className="sidebar-link"
            onClick={() => navigate("/profile")}
          >
            <span>👤</span>
            My Profile
          </button>
        </div>

        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <div className="help-icon">💡</div>

            <div>
              <strong>Keep Practicing!</strong>

              <p>
                Every interview makes you better.
              </p>
            </div>
          </div>

          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}

      <main className="dashboard-main">
        {/* TOP BAR */}

        <header className="dashboard-topbar">
          <div>
            <p className="topbar-small">
              PEER MATCHING
            </p>

            <h1>Find Peers</h1>
          </div>

          <button
            className="top-profile"
            onClick={() => navigate("/profile")}
          >
            <div className="top-avatar">
              {currentUser.fullName
                ?.charAt(0)
                .toUpperCase() || "S"}
            </div>

            <div className="top-profile-info">
              <strong>
                {currentUser.fullName || "Student"}
              </strong>

              <span>
                {currentUser.course || "Student"}
              </span>
            </div>

            <span className="profile-arrow">⌄</span>
          </button>
        </header>

        {/* ================= PAGE INTRO ================= */}

        <section className="peers-intro-card">
          <div>
            <p className="section-label">
              FIND YOUR INTERVIEW PARTNER
            </p>

            <h2>
              Connect. Practice. Improve.
            </h2>

            <p>
              Find students with similar skills and
              interview interests to practice together.
            </p>
          </div>

          <div className="peers-intro-icon">
            🔎
          </div>
        </section>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="peers-status-card">
            <div className="peers-loading-icon">
              🔎
            </div>

            <h3>
              Finding suitable peers...
            </h3>

            <p>
              We are looking for students who match
              your skills and preferences.
            </p>
          </div>
        )}

        {/* ================= ERROR ================= */}

        {message && (
          <div className="error-message">
            {message}
          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!loading &&
          !message &&
          peers.length === 0 && (
            <div className="peers-status-card">
              <div className="peers-loading-icon">
                👥
              </div>

              <h3>
                No peers found yet
              </h3>

              <p>
                Ask another student to create a
                PeerPrep account and complete their
                profile.
              </p>

              <button
                className="primary-dashboard-button"
                onClick={() => navigate("/profile")}
              >
                Complete My Profile
              </button>
            </div>
          )}

        {/* ================= PEER GRID ================= */}

        {!loading &&
          !message &&
          peers.length > 0 && (
            <section className="peers-section">
              <div className="peers-section-header">
                <div>
                  <p className="section-label">
                    AVAILABLE STUDENTS
                  </p>

                  <h2>
                    Recommended Peers
                  </h2>
                </div>

                <span className="peer-count">
                  {peers.length}{" "}
                  {peers.length === 1
                    ? "Peer"
                    : "Peers"}{" "}
                  Found
                </span>
              </div>

              <div className="modern-peer-grid">
                {peers.map((peer) => (
                  <div
                    className="modern-peer-card"
                    key={peer.id || peer._id}
                  >
                    {/* CARD HEADER */}

                    <div className="modern-peer-header">
                      <div className="modern-peer-avatar">
                        {peer.fullName
                          ?.charAt(0)
                          .toUpperCase() || "S"}
                      </div>

                      <div className="modern-peer-name">
                        <h3>
                          {peer.fullName}
                        </h3>

                        <p>
                          {peer.course ||
                            "Student"}

                          {peer.year
                            ? ` • ${peer.year}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    {/* MATCH SCORE */}

                    <div className="modern-match-box">
                      <div>
                        <span>
                          Match Score
                        </span>

                        <strong>
                          {peer.matchScore || 0}
                        </strong>
                      </div>

                      <div className="match-circle">
                        %
                      </div>
                    </div>

                    {/* COLLEGE */}

                    <div className="modern-peer-college">
                      <span>🏫</span>

                      <div>
                        <small>College</small>

                        <strong>
                          {peer.college ||
                            "Not added"}
                        </strong>
                      </div>
                    </div>

                    {/* SKILLS */}

                    <div className="modern-peer-section">
                      <h4>
                        Skills
                      </h4>

                      <div className="modern-tags">
                        {peer.skills?.length > 0 ? (
                          peer.skills
                            .slice(0, 5)
                            .map((skill, index) => (
                              <span key={index}>
                                {skill}
                              </span>
                            ))
                        ) : (
                          <small>
                            No skills added
                          </small>
                        )}
                      </div>
                    </div>

                    {/* INTERVIEW TYPES */}

                    <div className="modern-peer-section">
                      <h4>
                        Interview Types
                      </h4>

                      <div className="modern-tags interview-tags">
                        {peer.interviewTypes?.length > 0 ? (
                          peer.interviewTypes
                            .slice(0, 4)
                            .map((type, index) => (
                              <span key={index}>
                                {type}
                              </span>
                            ))
                        ) : (
                          <small>
                            No preferences added
                          </small>
                        )}
                      </div>
                    </div>

                    {/* MATCHED SKILLS */}

                    {peer.matchedSkills?.length > 0 && (
                      <div className="modern-matched-box">
                        <span>✓</span>

                        <div>
                          <small>
                            Matching Skills
                          </small>

                          <p>
                            {peer.matchedSkills.join(
                              ", "
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* REQUEST BUTTON */}

                    <button
                      className="modern-request-button"
                      onClick={() =>
                        handleRequest(peer)
                      }
                    >
                      🎤 Request Mock Interview
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
      </main>
    </div>
  );
}

export default Peers;
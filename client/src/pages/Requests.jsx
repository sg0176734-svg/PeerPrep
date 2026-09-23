import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Requests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const currentUser = JSON.parse(
    localStorage.getItem("peerprepUser") || "{}"
  );

  // =========================
  // FETCH INTERVIEW REQUESTS
  // =========================
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("peerprepToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/interview/received",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setRequests(response.data.requests || []);
      }
    } catch (error) {
      console.error("Fetch requests error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load interview requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // =========================
  // ACCEPT REQUEST
  // =========================
  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem("peerprepToken");

      const meetingLink = window.prompt(
        "Enter meeting link (optional):",
        "https://meet.google.com/"
      );

      if (meetingLink === null) {
        return;
      }

      const duration = window.prompt(
        "Enter interview duration in minutes:",
        "30"
      );

      if (duration === null) {
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/interview/request/${requestId}/accept`,
        {
          meetingLink,
          duration: Number(duration),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Interview request accepted successfully!");
        fetchRequests();
      }
    } catch (error) {
      console.error("Accept request error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to accept interview request."
      );
    }
  };

  // =========================
  // REJECT REQUEST
  // =========================
  const handleReject = async (requestId) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this request?"
    );

    if (!confirmReject) {
      return;
    }

    try {
      const token = localStorage.getItem("peerprepToken");

      const response = await axios.put(
        `http://localhost:5000/api/interview/request/${requestId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Interview request rejected.");
        fetchRequests();
      }
    } catch (error) {
      console.error("Reject request error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to reject interview request."
      );
    }
  };

  // =========================
  // HELPERS
  // =========================
  const getInitial = (name) => {
    return name?.charAt(0)?.toUpperCase() || "S";
  };

  const getStatusClass = (status) => {
    return `modern-status ${status?.toLowerCase()}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("peerprepToken");
    localStorage.removeItem("peerprepUser");
    navigate("/login");
  };

  // =========================
  // SIDEBAR
  // =========================
  const Sidebar = () => {
    return (
      <aside className="dashboard-sidebar">
        {/* LOGO */}
        <div className="sidebar-logo">
          <div className="logo-icon">P</div>

          <div>
            <h2>PeerPrep</h2>
            <span>Students Helping Students</span>
          </div>
        </div>

        {/* MENU */}
        <div className="sidebar-menu">
          <p className="menu-title">MAIN MENU</p>

          {/* Dashboard */}
          <button
            className="sidebar-link"
            onClick={() => navigate("/dashboard")}
          >
            <span>🏠</span>
            Dashboard
          </button>

          {/* Find Peers */}
          <button
            className="sidebar-link"
            onClick={() => navigate("/peers")}
          >
            <span>🔎</span>
            Find Peers
          </button>

          {/* Interview Requests */}
          <button className="sidebar-link active">
            <span>📩</span>
            Interview Requests
          </button>

          {/* My Interviews */}
          <button
            className="sidebar-link"
            onClick={() => navigate("/interviews")}
          >
            <span>🎤</span>
            My Interviews
          </button>

          <p className="menu-title second-menu-title">
            PERSONAL
          </p>

          {/* My Feedback */}
          <button
            className="sidebar-link"
            onClick={() => navigate("/feedback-history")}
          >
            <span>⭐</span>
            My Feedback
          </button
            >

          {/* My Profile */}
          <button
            className="sidebar-link"
            onClick={() => navigate("/profile")}
          >
            <span>👤</span>
            My Profile
          </button>
        </div>

        {/* BOTTOM */}
        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <div className="help-icon">💡</div>

            <div>
              <strong>Need Help?</strong>
              <span>We're here for you.</span>
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
    );
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="modern-dashboard">
        <Sidebar />

        <main className="dashboard-main">
          <div className="modern-loading">
            <div className="loading-spinner"></div>

            <h2>Loading requests...</h2>

            <p>
              Please wait while we fetch your interview requests.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="modern-dashboard">
      <Sidebar />

      <main className="dashboard-main">
        {/* TOP BAR */}
        <header className="dashboard-topbar">
          <div>
            <p className="topbar-small">PEERPREP</p>

            <h1>Interview Requests</h1>
          </div>

          <button
            className="top-profile"
            onClick={() => navigate("/profile")}
          >
            <div className="top-avatar">
              {getInitial(currentUser.fullName)}
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

        {/* PAGE INTRO */}
        <section className="requests-modern-header">
          <div>
            <p className="welcome-label">
              CONNECT WITH YOUR PEERS
            </p>

            <h2>Incoming Interview Requests</h2>

            <p>
              Review requests from students who want to
              practice interviews with you.
            </p>
          </div>

          <button
            className="primary-dashboard-button"
            onClick={() => navigate("/peers")}
          >
            + Find More Peers
          </button>
        </section>

        {/* ERROR MESSAGE */}
        {message && (
          <div className="error-message">
            {message}
          </div>
        )}

        {/* NO REQUESTS */}
        {requests.length === 0 ? (
          <div className="modern-empty-card">
            <div className="modern-empty-icon">
              📭
            </div>

            <h2>No Interview Requests</h2>

            <p>
              You don't have any interview requests right now.
              Find students and start practicing together.
            </p>

            <button
              className="primary-dashboard-button"
              onClick={() => navigate("/peers")}
            >
              Find Peers
            </button>
          </div>
        ) : (
          /* REQUEST LIST */
          <section className="modern-requests-section">
            <div className="modern-section-header">
              <div>
                <span className="section-label">
                  REQUESTS
                </span>

                <h2>
                  {requests.length}{" "}
                  {requests.length === 1
                    ? "Request"
                    : "Requests"}
                </h2>
              </div>
            </div>

            <div className="modern-requests-list">
              {requests.map((request) => (
                <div
                  className="modern-request-card"
                  key={request._id}
                >
                  {/* PERSON + STATUS */}
                  <div className="modern-request-top">
                    <div className="modern-request-person">
                      <div className="modern-request-avatar">
                        {getInitial(
                          request.sender?.fullName
                        )}
                      </div>

                      <div>
                        <h3>
                          {request.sender?.fullName ||
                            "Student"}
                        </h3>

                        <p>
                          {request.sender?.course ||
                            "Student"}

                          {request.sender?.year
                            ? ` • ${request.sender.year}`
                            : ""}
                        </p>

                        {request.sender?.college && (
                          <small>
                            🏫 {request.sender.college}
                          </small>
                        )}
                      </div>
                    </div>

                    <span
                      className={getStatusClass(
                        request.status
                      )}
                    >
                      {request.status}
                    </span>
                  </div>

                  {/* REQUEST DETAILS */}
                  <div className="modern-request-info">
                    <div className="modern-info-box">
                      <span>INTERVIEW TYPE</span>

                      <strong>
                        {request.interviewType ||
                          "General"}
                      </strong>
                    </div>

                    <div className="modern-info-box">
                      <span>TOPIC</span>

                      <strong>
                        {request.topic ||
                          "General Practice"}
                      </strong>
                    </div>

                    <div className="modern-info-box">
                      <span>PROPOSED DATE</span>

                      <strong>
                        {request.proposedDate
                          ? new Date(
                              request.proposedDate
                            ).toLocaleString()
                          : "Not specified"}
                      </strong>
                    </div>
                  </div>

                  {/* MESSAGE */}
                  {request.message && (
                    <div className="modern-request-message">
                      <span>
                        MESSAGE FROM STUDENT
                      </span>

                      <p>{request.message}</p>
                    </div>
                  )}

                  {/* PENDING ACTIONS */}
                  {request.status === "Pending" && (
                    <div className="modern-request-actions">
                      <button
                        className="modern-accept-button"
                        onClick={() =>
                          handleAccept(request._id)
                        }
                      >
                        ✓ Accept Request
                      </button>

                      <button
                        className="modern-reject-button"
                        onClick={() =>
                          handleReject(request._id)
                        }
                      >
                        ✕ Reject
                      </button>
                    </div>
                  )}

                  {/* ACCEPTED */}
                  {request.status === "Accepted" && (
                    <div className="modern-request-success">
                      ✓ Interview scheduled successfully.
                    </div>
                  )}

                  {/* REJECTED */}
                  {request.status === "Rejected" && (
                    <div className="modern-request-rejected">
                      This request was rejected.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Requests;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyInterviews() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const currentUser = JSON.parse(
    localStorage.getItem("peerprepUser") || "{}"
  );

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem("peerprepToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/interview/my-interviews",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setInterviews(response.data.sessions || []);
      }
    } catch (error) {
      console.error("Fetch interviews error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load interviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleComplete = async (sessionId) => {
    const confirmComplete = window.confirm(
      "Mark this interview as completed?"
    );

    if (!confirmComplete) return;

    try {
      const token = localStorage.getItem("peerprepToken");

      const response = await axios.put(
        `http://localhost:5000/api/interview/${sessionId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Interview marked as completed!");
        fetchInterviews();
      }
    } catch (error) {
      console.error("Complete interview error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to complete interview."
      );
    }
  };

  const getOtherPerson = (interview) => {
    const currentId = currentUser.id;

    if (
      interview.candidate?._id?.toString() ===
      currentId?.toString()
    ) {
      return interview.interviewer;
    }

    return interview.candidate;
  };

  const getMyRole = (interview) => {
    const currentId = currentUser.id;

    if (
      interview.candidate?._id?.toString() ===
      currentId?.toString()
    ) {
      return "Candidate";
    }

    return "Interviewer";
  };

  const getInitial = (name) => {
    return name?.charAt(0)?.toUpperCase() || "S";
  };

  const getStatusClass = (status) => {
    return `modern-status ${status?.toLowerCase()}`;
  };

  const handleGiveFeedback = (interview) => {
    navigate("/feedback", {
      state: {
        interview: interview,
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("peerprepToken");
    localStorage.removeItem("peerprepUser");
    navigate("/login");
  };

  /* =========================
     SIDEBAR
  ========================= */

  const Sidebar = () => (
    <aside className="dashboard-sidebar">

      {/* LOGO */}

      <div className="sidebar-logo">

        <div className="logo-icon">
          P
        </div>

        <div>
          <h2>PeerPrep</h2>

          <span>
            Students Helping Students
          </span>
        </div>

      </div>

      {/* MENU */}

      <div className="sidebar-menu">

        <p className="menu-title">
          MAIN MENU
        </p>

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
          className="sidebar-link active"
          onClick={() => navigate("/interviews")}
        >
          <span>🎤</span>
          My Interviews
        </button>

        <p className="menu-title second-menu-title">
          PERSONAL
        </p>

        <button
          className="sidebar-link"
          onClick={() => navigate("/feedback-history")}
        >
          <span>⭐</span>
          My Feedback
        </button>

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

          <div className="help-icon">
            💡
          </div>

          <div>
            <strong>
              Keep Practicing!
            </strong>

            <span>
              Every interview makes you better.
            </span>
          </div>

        </div>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <span>↪</span>
          Logout
        </button>

      </div>

    </aside>
  );

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="modern-dashboard">

        <Sidebar />

        <main className="dashboard-main">

          <div className="modern-loading">

            <div className="loading-spinner"></div>

            <h2>
              Loading interviews...
            </h2>

            <p>
              Please wait while we fetch your interviews.
            </p>

          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="modern-dashboard">

      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar />

      {/* =========================
          MAIN
      ========================= */}

      <main className="dashboard-main">

        {/* TOP BAR */}

        <header className="dashboard-topbar">

          <div>

            <p className="topbar-small">
              PEERPREP
            </p>

            <h1>
              My Interviews
            </h1>

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

            <span className="profile-arrow">
              ⌄
            </span>

          </button>

        </header>

        {/* PAGE HEADER */}

        <section className="interviews-modern-header">

          <div>

            <p className="welcome-label">
              INTERVIEW PRACTICE
            </p>

            <h2>
              Scheduled Interviews
            </h2>

            <p>
              Manage your upcoming and completed peer
              mock interviews.
            </p>

          </div>

          <button
            className="primary-dashboard-button"
            onClick={() => navigate("/peers")}
          >
            + Find Interview Partner
          </button>

        </section>

        {/* ERROR MESSAGE */}

        {message && (
          <div className="error-message">
            {message}
          </div>
        )}

        {/* =========================
            EMPTY STATE
        ========================= */}

        {interviews.length === 0 ? (

          <div className="modern-empty-card">

            <div className="modern-empty-icon">
              📅
            </div>

            <h2>
              No Interviews Yet
            </h2>

            <p>
              Find another student and schedule your
              first peer mock interview.
            </p>

            <button
              className="primary-dashboard-button"
              onClick={() => navigate("/peers")}
            >
              Find a Peer
            </button>

          </div>

        ) : (

          /* =========================
             INTERVIEW LIST
          ========================= */

          <section className="modern-interviews-section">

            <div className="modern-section-header">

              <div>

                <span className="section-label">
                  YOUR INTERVIEWS
                </span>

                <h2>
                  {interviews.length}{" "}
                  {interviews.length === 1
                    ? "Interview"
                    : "Interviews"}
                </h2>

              </div>

            </div>

            <div className="modern-interviews-list">

              {interviews.map((interview) => {

                const otherPerson =
                  getOtherPerson(interview);

                const myRole =
                  getMyRole(interview);

                return (

                  <div
                    className="modern-interview-card"
                    key={interview._id}
                  >

                    {/* PERSON + STATUS */}

                    <div className="modern-interview-top">

                      <div className="modern-interview-person">

                        <div className="modern-interview-avatar">
                          {getInitial(
                            otherPerson?.fullName
                          )}
                        </div>

                        <div>

                          <h3>
                            {otherPerson?.fullName ||
                              "Student"}
                          </h3>

                          <p>
                            {otherPerson?.course ||
                              "Student"}

                            {otherPerson?.year
                              ? ` • ${otherPerson.year}`
                              : ""}
                          </p>

                          {otherPerson?.college && (
                            <small>
                              🏫 {otherPerson.college}
                            </small>
                          )}

                        </div>

                      </div>

                      <span
                        className={getStatusClass(
                          interview.status
                        )}
                      >
                        {interview.status}
                      </span>

                    </div>

                    {/* DETAILS */}

                    <div className="modern-interview-info">

                      <div className="modern-info-box">

                        <span>
                          YOUR ROLE
                        </span>

                        <strong>
                          {myRole}
                        </strong>

                      </div>

                      <div className="modern-info-box">

                        <span>
                          INTERVIEW TYPE
                        </span>

                        <strong>
                          {interview.interviewType}
                        </strong>

                      </div>

                      <div className="modern-info-box">

                        <span>
                          TOPIC
                        </span>

                        <strong>
                          {interview.topic ||
                            "General Practice"}
                        </strong>

                      </div>

                      <div className="modern-info-box">

                        <span>
                          DURATION
                        </span>

                        <strong>
                          {interview.duration} minutes
                        </strong>

                      </div>

                      <div className="modern-info-box">

                        <span>
                          DATE & TIME
                        </span>

                        <strong>
                          {new Date(
                            interview.scheduledAt
                          ).toLocaleString()}
                        </strong>

                      </div>

                    </div>

                    {/* ONLINE MEETING */}

                    {interview.meetingLink && (

                      <div className="modern-meeting-box">

                        <div>

                          <span>
                            ONLINE MEETING
                          </span>

                          <strong>
                            Your interview room is ready
                          </strong>

                          <p>
                            Click the button to join your
                            scheduled interview.
                          </p>

                        </div>

                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="modern-join-button"
                        >
                          Join Interview →
                        </a>

                      </div>

                    )}

                    {/* SCHEDULED */}

                    {interview.status === "Scheduled" && (

                      <div className="modern-interview-actions">

                        <button
                          className="modern-complete-button"
                          onClick={() =>
                            handleComplete(
                              interview._id
                            )
                          }
                        >
                          ✓ Mark as Completed
                        </button>

                      </div>

                    )}

                    {/* COMPLETED */}

                    {interview.status === "Completed" && (

                      <div className="modern-completed-section">

                        <div className="modern-completed-message">
                          ✓ Interview completed successfully
                        </div>

                        <button
                          className="modern-feedback-button"
                          onClick={() =>
                            handleGiveFeedback(interview)
                          }
                        >
                          ⭐ Give Feedback
                        </button>

                      </div>

                    )}

                  </div>

                );
              })}

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default MyInterviews;
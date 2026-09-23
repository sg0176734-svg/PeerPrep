import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("peerprepToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [profileResponse, interviewResponse] =
          await Promise.all([
            axios.get(
              "http://localhost:5000/api/user/profile",
              config
            ),
            axios.get(
              "http://localhost:5000/api/interview/my-interviews",
              config
            ),
          ]);

        if (profileResponse.data.success) {
          setUser(profileResponse.data.user);

          localStorage.setItem(
            "peerprepUser",
            JSON.stringify(profileResponse.data.user)
          );
        }

        if (interviewResponse.data.success) {
          setInterviews(
            interviewResponse.data.sessions ||
              interviewResponse.data.interviews ||
              []
          );
        }
      } catch (error) {
        console.error("Dashboard error:", error);

        localStorage.removeItem("peerprepToken");
        localStorage.removeItem("peerprepUser");

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("peerprepToken");
    localStorage.removeItem("peerprepUser");
    navigate("/login");
  };

  const completedInterviews = interviews.filter(
    (item) => item.status === "Completed"
  ).length;

  const scheduledInterviews = interviews.filter(
    (item) => item.status === "Scheduled"
  ).length;

  const profileCompleted =
    user?.college &&
    user?.course &&
    user?.year &&
    user?.skills?.length > 0;

  if (loading) {
    return (
      <div className="loading-page">
        <h2>Loading PeerPrep...</h2>
      </div>
    );
  }

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
          <p className="menu-title">
            MAIN MENU
          </p>

          <button className="sidebar-link active">
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
            className="sidebar-link"
            onClick={() =>
              navigate("/feedback-history")
            }
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
            <div className="help-icon">
              💡
            </div>

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
              STUDENT DASHBOARD
            </p>

            <h1>Dashboard</h1>
          </div>

          <button
            className="top-profile"
            onClick={() => navigate("/profile")}
          >
            <div className="top-avatar">
              {user?.fullName
                ?.charAt(0)
                .toUpperCase() || "S"}
            </div>

            <div className="top-profile-info">
              <strong>
                {user?.fullName || "Student"}
              </strong>

              <span>
                {user?.course || "Student"}
              </span>
            </div>

            <span className="profile-arrow">
              ⌄
            </span>
          </button>
        </header>

        {/* ================= WELCOME ================= */}

        <section className="dashboard-welcome">
          <div className="welcome-content">
            <p className="welcome-label">
              WELCOME BACK 👋
            </p>

            <h2>
              Hi,{" "}
              {user?.fullName?.split(" ")[0] ||
                "Student"}
              !
            </h2>

            <p>
              Ready to improve your interview skills
              today? Practice with your peers and
              become placement ready.
            </p>

            <button
              className="primary-dashboard-button"
              onClick={() => navigate("/peers")}
            >
              Find a Peer →
            </button>
          </div>

          <div className="welcome-illustration">
            <div className="illustration-circle">
              🎓
            </div>

            <div className="floating-card floating-card-one">
              🎤 Mock Interview
            </div>

            <div className="floating-card floating-card-two">
              ⭐ Feedback
            </div>
          </div>
        </section>

        {/* ================= STAT CARDS ================= */}

        <section className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon blue-icon">
              👥
            </div>

            <div>
              <span>
                Profile Status
              </span>

              <h3>
                {profileCompleted
                  ? "Complete"
                  : "Incomplete"}
              </h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple-icon">
              📅
            </div>

            <div>
              <span>
                Scheduled
              </span>

              <h3>
                {scheduledInterviews}
              </h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green-icon">
              ✓
            </div>

            <div>
              <span>
                Completed
              </span>

              <h3>
                {completedInterviews}
              </h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange-icon">
              ●
            </div>

            <div>
              <span>
                Availability
              </span>

              <h3 className="availability-stat">
                {user?.isAvailableForMock
                  ? "Available"
                  : "Offline"}
              </h3>
            </div>
          </div>
        </section>

        {/* ================= CONTENT GRID ================= */}

        <section className="dashboard-content-grid">
          {/* LEFT COLUMN */}

          <div className="dashboard-left-column">
            {/* QUICK ACTIONS */}

            <div className="dashboard-section-card">
              <div className="section-card-header">
                <div>
                  <p className="section-label">
                    QUICK ACTIONS
                  </p>

                  <h2>
                    What would you like to do?
                  </h2>
                </div>
              </div>

              <div className="quick-actions-grid">
                <div
                  className="quick-action"
                  onClick={() =>
                    navigate("/peers")
                  }
                >
                  <div className="quick-icon blue-bg">
                    🔎
                  </div>

                  <h3>
                    Find Peers
                  </h3>

                  <p>
                    Find students with similar
                    skills.
                  </p>

                  <span>
                    Explore →
                  </span>
                </div>

                <div
                  className="quick-action"
                  onClick={() =>
                    navigate("/requests")
                  }
                >
                  <div className="quick-icon purple-bg">
                    📩
                  </div>

                  <h3>
                    Requests
                  </h3>

                  <p>
                    Manage your interview
                    requests.
                  </p>

                  <span>
                    View Requests →
                  </span>
                </div>

                <div
                  className="quick-action"
                  onClick={() =>
                    navigate("/interviews")
                  }
                >
                  <div className="quick-icon green-bg">
                    🎤
                  </div>

                  <h3>
                    My Interviews
                  </h3>

                  <p>
                    View upcoming interviews.
                  </p>

                  <span>
                    View Interviews →
                  </span>
                </div>

                <div
                  className="quick-action"
                  onClick={() =>
                    navigate("/profile")
                  }
                >
                  <div className="quick-icon orange-bg">
                    👤
                  </div>

                  <h3>
                    My Profile
                  </h3>

                  <p>
                    Update your skills and
                    preferences.
                  </p>

                  <span>
                    Edit Profile →
                  </span>
                </div>
              </div>
            </div>

            {/* RECENT INTERVIEWS */}

            <div className="dashboard-section-card">
              <div className="section-card-header">
                <div>
                  <p className="section-label">
                    YOUR ACTIVITY
                  </p>

                  <h2>
                    Recent Interviews
                  </h2>
                </div>

                <button
                  className="view-all-button"
                  onClick={() =>
                    navigate("/interviews")
                  }
                >
                  View All
                </button>
              </div>

              {interviews.length === 0 ? (
                <div className="dashboard-empty">
                  <div>
                    🎤
                  </div>

                  <h3>
                    No interviews yet
                  </h3>

                  <p>
                    Find a peer and schedule your
                    first mock interview.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/peers")
                    }
                  >
                    Find a Peer
                  </button>
                </div>
              ) : (
                <div className="dashboard-interviews">
                  {interviews
                    .slice(0, 3)
                    .map((interview) => {
                      const currentUser = JSON.parse(
                        localStorage.getItem(
                          "peerprepUser"
                        ) || "{}"
                      );

                      const currentUserId =
                        currentUser?.id ||
                        currentUser?._id;

                      const candidateId =
                        interview.candidate?._id ||
                        interview.candidate;

                      const otherPerson =
                        String(candidateId) ===
                        String(currentUserId)
                          ? interview.interviewer
                          : interview.candidate;

                      return (
                        <div
                          className="dashboard-interview-row"
                          key={interview._id}
                        >
                          <div className="interview-row-avatar">
                            {otherPerson?.fullName
                              ?.charAt(0)
                              .toUpperCase() ||
                              "S"}
                          </div>

                          <div className="interview-row-info">
                            <h3>
                              {interview.interviewType}
                            </h3>

                            <p>
                              With{" "}
                              {otherPerson?.fullName ||
                                "Student"}
                            </p>
                          </div>

                          <div className="interview-row-topic">
                            <span>
                              Topic
                            </span>

                            <strong>
                              {interview.topic ||
                                "General"}
                            </strong>
                          </div>

                          <div
                            className={`dashboard-status ${
                              interview.status ===
                              "Completed"
                                ? "status-green"
                                : "status-blue"
                            }`}
                          >
                            {interview.status}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}

          <aside className="dashboard-right-column">
            {/* PROFILE CARD */}

            <div className="student-profile-card">
              <div className="profile-card-top">
                <div className="large-profile-avatar">
                  {user?.fullName
                    ?.charAt(0)
                    .toUpperCase() ||
                    "S"}
                </div>

                <div>
                  <h2>
                    {user?.fullName ||
                      "Student"}
                  </h2>

                  <p>
                    {user?.course ||
                      "Course not added"}
                  </p>
                </div>
              </div>

              <div className="profile-divider"></div>

              <div className="profile-detail">
                <span>
                  College
                </span>

                <strong>
                  {user?.college ||
                    "College not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  Year
                </span>

                <strong>
                  {user?.year ||
                    "Year not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  Preferred Role
                </span>

                <strong>
                  {user?.preferredRole ||
                    "Both"}
                </strong>
              </div>

              <div className="profile-availability">
                <span
                  className={
                    user?.isAvailableForMock
                      ? "online-dot"
                      : "offline-dot"
                  }
                ></span>

                {user?.isAvailableForMock
                  ? "Available for Mock Interviews"
                  : "Currently Unavailable"}
              </div>

              <button
                className="edit-profile-button"
                onClick={() =>
                  navigate("/profile")
                }
              >
                View & Edit Profile
              </button>
            </div>

            {/* HOW IT WORKS */}

            <div className="how-card">
              <p className="section-label">
                HOW PEERPREP WORKS
              </p>

              <h2>
                Practice. Improve. Succeed.
              </h2>

              <div className="mini-step">
                <span>
                  01
                </span>

                <div>
                  <strong>
                    Create Profile
                  </strong>

                  <p>
                    Add your skills and
                    interests.
                  </p>
                </div>
              </div>

              <div className="mini-step">
                <span>
                  02
                </span>

                <div>
                  <strong>
                    Find a Peer
                  </strong>

                  <p>
                    Connect with matching
                    students.
                  </p>
                </div>
              </div>

              <div className="mini-step">
                <span>
                  03
                </span>

                <div>
                  <strong>
                    Practice Interview
                  </strong>

                  <p>
                    Conduct a mock interview.
                  </p>
                </div>
              </div>

              <div className="mini-step">
                <span>
                  04
                </span>

                <div>
                  <strong>
                    Get Feedback
                  </strong>

                  <p>
                    Learn and improve your
                    skills.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
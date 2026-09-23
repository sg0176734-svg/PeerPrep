import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();

  const token = localStorage.getItem("peerprepToken");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    college: "",
    course: "",
    year: "",
    skills: "",
    interviewTopics: "",
    interviewTypes: [],
    preferredRole: "",
    availability: "",
    isAvailableForMock: false,
    bio: "",
    profileImage: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "https://peerprep-backend-7qvh.onrender.com/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = response.data.user;

        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          college: user.college || "",
          course: user.course || "",
          year: user.year || "",
          skills: Array.isArray(user.skills)
            ? user.skills.join(", ")
            : user.skills || "",
          interviewTopics: Array.isArray(user.interviewTopics)
            ? user.interviewTopics.join(", ")
            : user.interviewTopics || "",
          interviewTypes: Array.isArray(user.interviewTypes)
            ? user.interviewTypes
            : [],
          preferredRole: user.preferredRole || "",
          availability: user.availability || "",
          isAvailableForMock: Boolean(user.isAvailableForMock),
          bio: user.bio || "",
          profileImage: user.profileImage || "",
        });
      } catch (err) {
        console.error("Profile fetch error:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("peerprepToken");
          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.message ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
    setError("");
  };

  const handleInterviewTypeChange = (type) => {
    setFormData((prev) => {
      const exists = prev.interviewTypes.includes(type);

      return {
        ...prev,
        interviewTypes: exists
          ? prev.interviewTypes.filter((item) => item !== type)
          : [...prev.interviewTypes, type],
      };
    });

    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        college: formData.college.trim(),
        course: formData.course.trim(),
        year: formData.year,
        skills: formData.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        interviewTopics: formData.interviewTopics
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        interviewTypes: formData.interviewTypes,
        preferredRole: formData.preferredRole,
        availability: formData.availability.trim(),
        isAvailableForMock: formData.isAvailableForMock,
        bio: formData.bio.trim(),
        profileImage: formData.profileImage.trim(),
      };

      const response = await axios.put(
        "https://peerprep-backend-7qvh.onrender.com/api/user/profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data?.message || "Profile updated successfully!"
      );
    } catch (err) {
      console.error("Profile update error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("peerprepToken");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("peerprepToken");
    navigate("/login");
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  if (loading) {
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
              className="sidebar-link active"
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

            <button
              className="sidebar-logout"
              onClick={handleLogout}
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main className="dashboard-main">
          <div className="dashboard-topbar">
            <div>
              <span className="topbar-small">PEERPREP</span>
              <h2>My Profile</h2>
            </div>
          </div>

          <div className="page-container">
            <div className="empty-card">
              <h2>Loading profile...</h2>
              <p>Please wait while we load your profile.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside className="dashboard-sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">🤝</div>

          <div>
            <h2>PeerPrep</h2>
            <p>Students Helping Students</p>
          </div>
        </div>

        {/* Menu */}
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
            className="sidebar-link active"
            onClick={() => navigate("/profile")}
          >
            <span>👤</span>
            My Profile
          </button>
        </nav>

        {/* Bottom */}
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

          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="dashboard-main">
        {/* Topbar */}
        <div className="dashboard-topbar">
          <div>
            <span className="topbar-small">PEERPREP</span>
            <h2>My Profile</h2>
          </div>

          <div className="top-profile">
            <div className="top-avatar">👤</div>

            <div className="top-profile-info">
              <strong>{formData.fullName || "Student"}</strong>
              <span>{formData.email || "PeerPrep Student"}</span>
            </div>

            <span className="profile-arrow">⌄</span>
          </div>
        </div>

        {/* =================================================
            PROFILE CONTENT
        ================================================== */}
        <div className="page-container">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1>👤 My Profile</h1>

              <p>
                Keep your profile updated so other students can
                find the right mock interview partner.
              </p>
            </div>

            <button
              className="secondary-btn"
              onClick={() => navigate("/dashboard")}
            >
              ← Dashboard
            </button>
          </div>

          {/* Messages */}
          {message && (
            <div
              style={{
                background: "#ecfdf5",
                color: "#047857",
                border: "1px solid #a7f3d0",
                borderRadius: "12px",
                padding: "14px 18px",
                marginBottom: "20px",
                fontWeight: "600",
              }}
            >
              ✅ {message}
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
                borderRadius: "12px",
                padding: "14px 18px",
                marginBottom: "20px",
                fontWeight: "600",
              }}
            >
              ❌ {error}
            </div>
          )}

          {/* Profile Form */}
          <form
            className="modern-profile-form"
            onSubmit={handleSubmit}
          >
            {/* =================================================
                BASIC INFORMATION
            ================================================== */}
            <section className="modern-profile-section">
              <div className="modern-profile-section-heading">
                <div className="profile-section-icon blue-profile-icon">
                  👤
                </div>

                <div>
                  <h2>Basic Information</h2>
                  <p>
                    Tell other students a little about yourself.
                  </p>
                </div>
              </div>

              <div className="modern-profile-grid">
                {/* Full Name */}
                <div className="modern-form-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="modern-form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    placeholder="Your email"
                  />

                  <small>
                    Email cannot be changed from the profile page.
                  </small>
                </div>

                {/* College */}
                <div className="modern-form-group">
                  <label>College</label>

                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="Enter your college"
                  />
                </div>

                {/* Course */}
                <div className="modern-form-group">
                  <label>Course</label>

                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g. Computer Engineering"
                  />
                </div>

                {/* Year */}
                <div className="modern-form-group">
                  <label>Year</label>

                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                  >
                    <option value="">Select year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
            </section>

            {/* =================================================
                SKILLS & INTERVIEW PREFERENCES
            ================================================== */}
            <section className="modern-profile-section">
              <div className="modern-profile-section-heading">
                <div className="profile-section-icon purple-profile-icon">
                  🎯
                </div>

                <div>
                  <h2>Skills & Interview Preferences</h2>

                  <p>
                    These details help PeerPrep find suitable
                    interview partners.
                  </p>
                </div>
              </div>

              <div className="modern-profile-grid">
                {/* Skills */}
                <div className="modern-form-group">
                  <label>Skills</label>

                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Java, React, MongoDB, HTML"
                  />

                  <small>
                    Separate multiple skills using commas.
                  </small>
                </div>

                {/* Interview Topics */}
                <div className="modern-form-group">
                  <label>Interview Topics</label>

                  <input
                    type="text"
                    name="interviewTopics"
                    value={formData.interviewTopics}
                    onChange={handleChange}
                    placeholder="Java, DBMS, OOP, Web Development"
                  />

                  <small>
                    Separate multiple topics using commas.
                  </small>
                </div>

                {/* Preferred Role */}
                <div className="modern-form-group">
                  <label>Preferred Role</label>

                  <select
                    name="preferredRole"
                    value={formData.preferredRole}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select preferred role
                    </option>

                    <option value="Candidate">
                      Candidate
                    </option>

                    <option value="Interviewer">
                      Interviewer
                    </option>

                    <option value="Both">
                      Both
                    </option>
                  </select>
                </div>

                {/* Availability */}
                <div className="modern-form-group">
                  <label>Availability</label>

                  <input
                    type="text"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    placeholder="e.g. Weekdays 7 PM - 10 PM"
                  />
                </div>
              </div>

              {/* Interview Types */}
              <div
                className="modern-form-group"
                style={{ marginTop: "20px" }}
              >
                <label>Interview Types</label>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  {[
                    "Technical",
                    "HR",
                    "Coding",
                    "Communication",
                    "Resume",
                    "Aptitude",
                  ].map((type) => {
                    const selected =
                      formData.interviewTypes.includes(type);

                    return (
                      <button
                        type="button"
                        key={type}
                        onClick={() =>
                          handleInterviewTypeChange(type)
                        }
                        style={{
                          border: selected
                            ? "2px solid #6366f1"
                            : "1px solid #d1d5db",
                          background: selected
                            ? "#eef2ff"
                            : "#ffffff",
                          color: selected
                            ? "#4f46e5"
                            : "#374151",
                          padding: "10px 16px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: selected
                            ? "700"
                            : "500",
                          transition: "0.2s",
                        }}
                      >
                        {selected ? "✓ " : ""}
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mock Interview Toggle */}
              <div
                style={{
                  marginTop: "24px",
                  padding: "16px 18px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    name="isAvailableForMock"
                    checked={formData.isAvailableForMock}
                    onChange={handleChange}
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                    }}
                  />

                  <div>
                    <strong>
                      Available for Mock Interviews
                    </strong>

                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "#64748b",
                        fontSize: "14px",
                      }}
                    >
                      Allow other students to find and request
                      mock interviews with you.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {/* =================================================
                ABOUT
            ================================================== */}
            <section className="modern-profile-section">
              <div className="modern-profile-section-heading">
                <div className="profile-section-icon blue-profile-icon">
                  💬
                </div>

                <div>
                  <h2>About You</h2>

                  <p>
                    Add a short introduction for other students.
                  </p>
                </div>
              </div>

              <div className="modern-form-group">
                <label>Bio</label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Example: Computer engineering student interested in Java, web development and technical interviews."
                  rows="5"
                />

                <small>
                  Keep it short and useful for other students.
                </small>
              </div>
            </section>

            {/* =================================================
                PROFILE IMAGE
            ================================================== */}
            <section className="modern-profile-section">
              <div className="modern-profile-section-heading">
                <div className="profile-section-icon purple-profile-icon">
                  🖼️
                </div>

                <div>
                  <h2>Profile Image</h2>

                  <p>
                    Add an image URL if you want to display a
                    profile picture.
                  </p>
                </div>
              </div>

              <div className="modern-form-group">
                <label>Profile Image URL</label>

                <input
                  type="text"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="https://example.com/profile.jpg"
                />
              </div>

              {formData.profileImage && (
                <div
                  style={{
                    marginTop: "18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >
                  <img
                    src={formData.profileImage}
                    alt="Profile Preview"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #e2e8f0",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  <span
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                    }}
                  >
                    Profile image preview
                  </span>
                </div>
              )}
            </section>

            {/* =================================================
                ACTION BUTTONS
            ================================================== */}
            <div className="modern-request-interview-actions">
              <button
                type="button"
                className="modern-profile-cancel"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="modern-profile-save"
                disabled={saving}
              >
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Profile;
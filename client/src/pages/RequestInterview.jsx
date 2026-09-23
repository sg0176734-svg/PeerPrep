import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function RequestInterview() {
  const location = useLocation();
  const navigate = useNavigate();

  const peer = location.state?.peer;

  const [formData, setFormData] = useState({
    interviewType: "Technical",
    topic: "",
    proposedDate: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  if (!peer) {
    return (
      <div className="loading-page">
        <div>
          <h2>Peer not selected</h2>
          <button
            className="auth-button"
            onClick={() => navigate("/peers")}
          >
            Back to Peers
          </button>
        </div>
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
        "https://peerprep-backend-7qvh.onrender.com/api/interview/request",
        {
          receiverId: peer.id,
          interviewType: formData.interviewType,
          topic: formData.topic,
          proposedDate: formData.proposedDate,
          message: formData.message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setMessage("Interview request sent successfully!");

        setTimeout(() => {
          navigate("/peers");
        }, 1500);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to send interview request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-page">
      <nav className="dashboard-navbar">
        <div className="brand">
          <h2>PeerPrep</h2>
          <span>Students Helping Students</span>
        </div>

        <div className="nav-actions">
          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/peers")}>
            Find Peers
          </button>
        </div>
      </nav>

      <main className="request-container">
        <div className="request-card">
          <div className="request-header">
            <p className="small-heading">MOCK INTERVIEW</p>

            <h1>Request an Interview</h1>

            <p>
              Send a mock interview request to your selected
              peer.
            </p>
          </div>

          <div className="selected-peer">
            <div className="peer-avatar">
              {peer.fullName
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h3>{peer.fullName}</h3>

              <p>
                {peer.course || "Student"} •{" "}
                {peer.year || ""}
              </p>

              {peer.college && (
                <small>{peer.college}</small>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Interview Type</label>

              <select
                name="interviewType"
                value={formData.interviewType}
                onChange={handleChange}
              >
                <option value="Technical">
                  Technical
                </option>

                <option value="HR">HR</option>

                <option value="Coding">
                  Coding
                </option>

                <option value="Communication">
                  Communication
                </option>

                <option value="Resume">
                  Resume
                </option>

                <option value="Aptitude">
                  Aptitude
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Interview Topic</label>

              <input
                type="text"
                name="topic"
                placeholder="Example: Java, React, DBMS..."
                value={formData.topic}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Preferred Date & Time</label>

              <input
                type="datetime-local"
                name="proposedDate"
                value={formData.proposedDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>

              <textarea
                name="message"
                placeholder="Write a short message to your peer..."
                value={formData.message}
                onChange={handleChange}
                rows="4"
              ></textarea>
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

            <div className="request-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/peers")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading
                  ? "Sending..."
                  : "Send Interview Request"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default RequestInterview;
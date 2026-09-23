import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    college: "",
    course: "",
    year: "Other",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      if (response.data.success) {
        setMessage("Account created successfully! Redirecting...");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-logo">
          <h1>PeerPrep</h1>
          <p>Students Helping Students</p>
        </div>

        <h2>Create Account</h2>

        <p className="auth-subtitle">
          Create your student profile and start practicing.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <div className="form-group">
            <label>College</label>

            <input
              type="text"
              name="college"
              placeholder="Enter your college"
              value={formData.college}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Course</label>

            <input
              type="text"
              name="course"
              placeholder="Example: Computer Engineering"
              value={formData.course}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Year</label>

            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
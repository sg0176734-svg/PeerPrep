import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Peers from "./pages/Peers";
import RequestInterview from "./pages/RequestInterview";
import Requests from "./pages/Requests";
import MyInterviews from "./pages/MyInterviews";
import Profile from "./pages/Profile";
import Feedback from "./pages/Feedback";
import FeedbackHistory from "./pages/FeedbackHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/peers" element={<Peers />} />
        <Route path="/request-interview" element={<RequestInterview />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/interviews" element={<MyInterviews />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/feedback" element={<Feedback />} />
        <Route path="/feedback-history" element={<FeedbackHistory />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
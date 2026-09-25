import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileClock,
} from "lucide-react";

function FacultyDashboard() {
  const navigate = useNavigate();

  const [assignmentCount, setAssignmentCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [assignmentsResponse, sessionsResponse, attendanceResponse] =
          await Promise.all([
            api.get("/faculty-assignments"),
            api.get("/class-sessions"),
            api.get("/attendance/history"),
          ]);

        setAssignmentCount(assignmentsResponse.data.data.length);
        setSessionCount(sessionsResponse.data.data.length);
        setAttendanceCount(attendanceResponse.data.data.length);
      } catch (error) {
        console.error("Faculty Dashboard API failed:", error);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-content">
        <p className="eyebrow">Teaching workspace</p>
        <h1
          className="page-heading"
          style={{ display: "flex", alignItems: "center", gap: ".65rem" }}
        >
          <ClipboardCheck size={24} color="#3157a6" />
          Faculty Dashboard
        </h1>

        <div className="stat-grid">
          <div className="stat-card">
            <h3>
              <BookOpen
                size={17}
                style={{
                  verticalAlign: "middle",
                  marginRight: ".4rem",
                  color: "#3157a6",
                }}
              />
              My Assignments
            </h3>
            <p>{assignmentCount}</p>
          </div>

          <div className="stat-card">
            <h3>
              <CalendarDays
                size={17}
                style={{
                  verticalAlign: "middle",
                  marginRight: ".4rem",
                  color: "#3157a6",
                }}
              />
              Class Sessions
            </h3>
            <p>{sessionCount}</p>
          </div>

          <div className="stat-card">
            <h3>
              <FileClock
                size={17}
                style={{
                  verticalAlign: "middle",
                  marginRight: ".4rem",
                  color: "#3157a6",
                }}
              />
              Attendance Records
            </h3>
            <p>{attendanceCount}</p>
          </div>
        </div>

        <div className="action-grid">
          <button
            className="button"
            onClick={() => navigate("/faculty/assignments")}
          >
            My Assignments
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/faculty/sessions")}
          >
            Class Sessions
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/faculty/attendance")}
          >
            Attendance History
          </button>
        </div>
      </main>
    </div>
  );
}

export default FacultyDashboard;

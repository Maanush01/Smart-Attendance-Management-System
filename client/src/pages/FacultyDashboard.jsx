import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

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
    <div>
      <Navbar />

      <h1>Faculty Dashboard</h1>

      <div>
        <div>
          <h3>My Assignments</h3>
          <p>{assignmentCount}</p>
        </div>

        <div>
          <h3>Class Sessions</h3>
          <p>{sessionCount}</p>
        </div>

        <div>
          <h3>Attendance Records</h3>
          <p>{attendanceCount}</p>
        </div>
      </div>

      <button onClick={() => navigate("/faculty/assignments")}>
        My Assignments
      </button>

      <button onClick={() => navigate("/faculty/sessions")}>
        Class Sessions
      </button>

      <button onClick={() => navigate("/faculty/attendance")}>
        Attendance History
      </button>
    </div>
  );
}

export default FacultyDashboard;

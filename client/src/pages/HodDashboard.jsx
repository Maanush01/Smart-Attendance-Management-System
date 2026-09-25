import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { AlertTriangle, BookOpen, ClipboardCheck, Users } from "lucide-react";

function HodDashboard() {
  const navigate = useNavigate();

  const [studentCount, setStudentCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [lowAttendanceCount, setLowAttendanceCount] = useState(0);
  const [correctionCount, setCorrectionCount] = useState(0);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          studentsResponse,
          facultyResponse,
          subjectsResponse,
          lowAttendanceResponse,
          correctionsResponse,
        ] = await Promise.all([
          api.get("/students"),
          api.get("/faculty"),
          api.get("/subjects"),
          api.get("/attendance/low-attendance"),
          api.get("/corrections"),
        ]);

        setStudentCount(studentsResponse.data.data.length);
        setFacultyCount(facultyResponse.data.data.length);
        setSubjectCount(subjectsResponse.data.data.length);
        setLowAttendanceCount(lowAttendanceResponse.data.data.length);

        const pendingCorrections = correctionsResponse.data.data.filter(
          (request) => request.status === "PENDING",
        );

        setCorrectionCount(pendingCorrections.length);
      } catch (error) {
        console.error("HOD Dashboard API failed:", error);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-content">
        <p className="eyebrow">Department overview</p>
        <h1
          className="page-heading"
          style={{ display: "flex", alignItems: "center", gap: ".65rem" }}
        >
          <ClipboardCheck size={24} color="#3157a6" />
          HOD Dashboard
        </h1>

        <div className="stat-grid">
          <div className="stat-card">
            <h3>
              <Users
                size={17}
                style={{
                  verticalAlign: "middle",
                  marginRight: ".4rem",
                  color: "#3157a6",
                }}
              />
              Total Students
            </h3>
            <p>{studentCount}</p>
          </div>

          <div className="stat-card">
            <h3>
              <Users
                size={17}
                style={{
                  verticalAlign: "middle",
                  marginRight: ".4rem",
                  color: "#3157a6",
                }}
              />
              Total Faculty
            </h3>
            <p>{facultyCount}</p>
          </div>

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
              Total Subjects
            </h3>
            <p>{subjectCount}</p>
          </div>

          <div className="stat-card">
            <h3>
              <AlertTriangle
                size={17}
                style={{
                  verticalAlign: "middle",
                  marginRight: ".4rem",
                  color: "#a16207",
                }}
              />
              Low Attendance
            </h3>
            <p>{lowAttendanceCount}</p>
          </div>

          <div className="stat-card">
            <h3>
              <AlertTriangle
                size={17}
                style={{
                  verticalAlign: "middle",
                  marginRight: ".4rem",
                  color: "#a16207",
                }}
              />
              Pending Corrections
            </h3>
            <p>{correctionCount}</p>
          </div>
        </div>

        <div className="action-grid">
          <button className="button" onClick={() => navigate("/hod/students")}>
            Students
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/hod/faculty")}
          >
            Faculty
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/hod/subjects")}
          >
            Subjects
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/hod/attendance")}
          >
            Attendance
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/hod/low-attendance")}
          >
            Low Attendance
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/hod/correction-requests")}
          >
            Correction Requests
          </button>
        </div>
      </main>
    </div>
  );
}

export default HodDashboard;

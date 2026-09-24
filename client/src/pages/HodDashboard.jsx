import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

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
    <div>
      <Navbar />

      <h1>HOD Dashboard</h1>

      <div>
        <div>
          <h3>Total Students</h3>
          <p>{studentCount}</p>
        </div>

        <div>
          <h3>Total Faculty</h3>
          <p>{facultyCount}</p>
        </div>

        <div>
          <h3>Total Subjects</h3>
          <p>{subjectCount}</p>
        </div>

        <div>
          <h3>Low Attendance</h3>
          <p>{lowAttendanceCount}</p>
        </div>

        <div>
          <h3>Pending Corrections</h3>
          <p>{correctionCount}</p>
        </div>
      </div>

      <button onClick={() => navigate("/hod/students")}>Students</button>

      <button onClick={() => navigate("/hod/faculty")}>Faculty</button>

      <button onClick={() => navigate("/hod/subjects")}>Subjects</button>

      <button onClick={() => navigate("/hod/attendance")}>Attendance</button>

      <button onClick={() => navigate("/hod/low-attendance")}>
        Low Attendance
      </button>

      <button onClick={() => navigate("/hod/correction-requests")}>
        Correction Requests
      </button>
    </div>
  );
}

export default HodDashboard;

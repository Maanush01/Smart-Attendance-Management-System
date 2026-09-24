import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function AdminDashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [studentsResponse, departmentsResponse, facultyResponse] =
          await Promise.all([
            api.get("/students"),
            api.get("/departments"),
            api.get("/faculty"),
          ]);

        setStudentCount(studentsResponse.data.data.length);
        setDepartmentCount(departmentsResponse.data.data.length);
        setFacultyCount(facultyResponse.data.data.length);
      } catch (error) {
        console.error("Dashboard API failed:", error);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div>
      <Navbar />

      <h1>Admin Dashboard</h1>

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
          <h3>Total Departments</h3>
          <p>{departmentCount}</p>
        </div>
      </div>

      <button onClick={() => navigate("/admin/students")}>Students</button>

      <button onClick={() => navigate("/admin/faculty")}>Faculty</button>

      <button onClick={() => navigate("/admin/departments")}>
        Departments
      </button>

      <button onClick={() => navigate("/admin/programs")}>Programs</button>

      <button onClick={() => navigate("/admin/sections")}>Sections</button>

      <button onClick={() => navigate("/admin/subjects")}>Subjects</button>

      <button onClick={() => navigate("/admin/faculty-assignments")}>
        Faculty Assignments
      </button>

      <button onClick={() => navigate("/admin/class-sessions")}>
        Class Sessions
      </button>

      <button onClick={() => navigate("/admin/attendance-history")}>
        Attendance History
      </button>

      <button onClick={() => navigate("/admin/low-attendance")}>
        Low Attendance
      </button>

      <button onClick={() => navigate("/admin/correction-requests")}>
        Correction Requests
      </button>

      <button onClick={() => navigate("/admin/audit-logs")}>Audit Logs</button>
    </div>
  );
}

export default AdminDashboard;

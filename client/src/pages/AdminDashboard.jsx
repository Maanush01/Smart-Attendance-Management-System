import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { BarChart3, Building2, GraduationCap, Users } from "lucide-react";

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
    <div className="page-shell">
      <Navbar />

      <main className="page-content">
        <p className="eyebrow">Administration</p>
        <h1
          className="page-heading"
          style={{ display: "flex", alignItems: "center", gap: ".65rem" }}
        >
          <BarChart3 size={24} color="#3157a6" />
          Admin Dashboard
        </h1>

        <div className="stat-grid">
          <div className="stat-card">
            <h3>
              <GraduationCap
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
              <Building2
                size={17}
                style={{
                  verticalAlign: "middle",
                  marginRight: ".4rem",
                  color: "#3157a6",
                }}
              />
              Total Departments
            </h3>
            <p>{departmentCount}</p>
          </div>
        </div>

        <div className="action-grid">
          <button
            className="button"
            onClick={() => navigate("/admin/students")}
          >
            Students
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/admin/faculty")}
          >
            Faculty
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/admin/departments")}
          >
            Departments
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/admin/programs")}
          >
            Programs
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/admin/sections")}
          >
            Sections
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/admin/subjects")}
          >
            Subjects
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/admin/faculty-assignments")}
          >
            Faculty Assignments
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/admin/class-sessions")}
          >
            Class Sessions
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/admin/attendance-history")}
          >
            Attendance History
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/admin/low-attendance")}
          >
            Low Attendance
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/admin/correction-requests")}
          >
            Correction Requests
          </button>

          <button
            className="button button-secondary"
            onClick={() => navigate("/admin/audit-logs")}
          >
            Audit Logs
          </button>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;

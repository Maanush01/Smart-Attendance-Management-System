import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import HodDashboard from "./pages/HodDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Students from "./pages/Students";
import Faculty from "./pages/Faculty";
import Departments from "./pages/Departments";
import Programs from "./pages/Programs";
import Sections from "./pages/Sections";
import Subjects from "./pages/Subjects";
import FacultyAssignments from "./pages/FacultyAssignments";
import ClassSessions from "./pages/ClassSessions";
import AttendanceHistory from "./pages/AttendanceHistory";
import LowAttendance from "./pages/LowAttendance";
import CorrectionRequests from "./pages/CorrectionRequests";
import AuditLogs from "./pages/AuditLogs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AuditLogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/correction-requests"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <CorrectionRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/low-attendance"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <LowAttendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/attendance-history"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AttendanceHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/class-sessions"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ClassSessions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/faculty-assignments"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <FacultyAssignments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Subjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/programs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Programs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/sections"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Sections />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/departments"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Departments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hod"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <HodDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hod/students"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <Students />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hod/faculty"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <Faculty />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hod/subjects"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <Subjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hod/attendance"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <AttendanceHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hod/low-attendance"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <LowAttendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hod/correction-requests"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <CorrectionRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRoles={["FACULTY"]}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty/assignments"
          element={
            <ProtectedRoute allowedRoles={["FACULTY"]}>
              <FacultyAssignments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty/sessions"
          element={
            <ProtectedRoute allowedRoles={["FACULTY"]}>
              <ClassSessions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty/attendance"
          element={
            <ProtectedRoute allowedRoles={["FACULTY"]}>
              <AttendanceHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/faculty"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Faculty />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Students />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

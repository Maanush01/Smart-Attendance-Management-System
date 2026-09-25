import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  FileClock,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";

const navigationByRole = {
  ADMIN: [
    { label: "Overview", path: "/admin", icon: LayoutDashboard },
    { label: "Students", path: "/admin/students", icon: Users },
    { label: "Faculty", path: "/admin/faculty", icon: Users },
    { label: "Sessions", path: "/admin/class-sessions", icon: ClipboardCheck },
    { label: "Attendance", path: "/admin/attendance-history", icon: BarChart3 },
  ],
  HOD: [
    { label: "Overview", path: "/hod", icon: LayoutDashboard },
    { label: "Students", path: "/hod/students", icon: Users },
    { label: "Faculty", path: "/hod/faculty", icon: Users },
    { label: "Attendance", path: "/hod/attendance", icon: BarChart3 },
  ],
  FACULTY: [
    { label: "Overview", path: "/faculty", icon: LayoutDashboard },
    { label: "Assignments", path: "/faculty/assignments", icon: BookOpen },
    { label: "Sessions", path: "/faculty/sessions", icon: ClipboardCheck },
    { label: "History", path: "/faculty/attendance", icon: FileClock },
  ],
  STUDENT: [{ label: "Overview", path: "/student", icon: LayoutDashboard }],
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar" style={{ flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
        <div
          aria-hidden="true"
          style={{
            display: "grid",
            placeItems: "center",
            width: "2rem",
            height: "2rem",
            borderRadius: ".5rem",
            background: "#3157a6",
            color: "#fff",
          }}
        >
          <ClipboardCheck size={18} />
        </div>
        <div className="brand">Smart Attendance</div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: ".25rem",
          order: 3,
          width: "100%",
          overflowX: "auto",
          paddingTop: ".25rem",
        }}
      >
        {(navigationByRole[user?.role] || []).map(
          ({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".4rem",
                minHeight: "2.75rem",
                padding: ".5rem .75rem",
                borderRadius: ".5rem",
                color: location.pathname === path ? "#fff" : "#cbd5e1",
                background:
                  location.pathname === path ? "#263f75" : "transparent",
                fontSize: ".8125rem",
                fontWeight: 600,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ),
        )}
      </div>

      <span className="user-meta">
        {user?.name} ({user?.role})
      </span>

      <button className="button button-secondary" onClick={handleLogout}>
        <LogOut size={16} style={{ marginRight: ".4rem" }} />
        Logout
      </button>
    </nav>
  );
}

export default Navbar;

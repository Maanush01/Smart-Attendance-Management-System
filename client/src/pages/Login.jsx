import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));

      const role = response.data.data.user.role;

      if (role === "ADMIN") navigate("/admin");
      else if (role === "HOD") navigate("/hod");
      else if (role === "FACULTY") navigate("/faculty");
      else if (role === "STUDENT") navigate("/student");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
            marginBottom: "1.5rem",
            color: "#3157a6",
            fontSize: ".8125rem",
            fontWeight: 700,
          }}
        >
          <ShieldCheck size={18} />
          Secure campus workspace
        </div>
        <p className="eyebrow">College attendance portal</p>
        <h1>Welcome back</h1>
        <p className="login-subtitle">
          Sign in to manage your attendance workspace.
        </p>

        <form className="form-stack" onSubmit={handleLogin}>
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="button"
            type="submit"
            style={{ minHeight: "2.75rem" }}
          >
            Sign in
            <ArrowRight size={17} style={{ marginLeft: ".45rem" }} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

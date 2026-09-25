import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function Faculty() {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";

  const loadData = async () => {
    try {
      const facultyResponse = await api.get("/faculty");
      setFaculty(facultyResponse.data.data);

      if (isAdmin) {
        const departmentResponse = await api.get("/departments");
        setDepartments(departmentResponse.data.data);
      }
    } catch (error) {
      console.error("Failed to load faculty:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createFaculty = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/users", {
        name,
        email,
        password,
        role: "FACULTY",
        departmentId,
      });

      alert("Faculty created successfully.");

      setName("");
      setEmail("");
      setPassword("");
      setDepartmentId("");

      loadData();
    } catch (error) {
      console.error("Failed to create faculty:", error);

      alert(error.response?.data?.message || "Failed to create faculty.");
    }
  };

  return (
    <div>
      <Navbar />

      <h1>Faculty</h1>

      {isAdmin && (
        <div>
          <h2>Create Faculty</h2>

          <form onSubmit={createFaculty}>
            <input
              type="text"
              placeholder="Faculty Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Faculty Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              required
            >
              <option value="">Select Department</option>

              {departments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.name}
                </option>
              ))}
            </select>

            <button type="submit">Create Faculty</button>
          </form>
        </div>
      )}

      <h2>Faculty List</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {faculty.map((member) => (
            <tr key={member._id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.isActive ? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Faculty;

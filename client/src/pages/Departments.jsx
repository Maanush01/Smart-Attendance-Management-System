import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const loadDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data.data);
    } catch (error) {
      console.error("Failed to load departments:", error);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const createDepartment = async (e) => {
    e.preventDefault();

    try {
      await api.post("/departments", {
        name,
        code,
      });

      alert("Department created successfully.");

      setName("");
      setCode("");

      loadDepartments();
    } catch (error) {
      console.error("Failed to create department:", error);
      alert("Failed to create department.");
    }
  };

  return (
    <div>
      <Navbar />

      <h1>Departments</h1>

      <h2>Create Department</h2>

      <form onSubmit={createDepartment}>
        <input
          type="text"
          placeholder="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Department Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <button type="submit">Create Department</button>
      </form>

      <h2>Department List</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Dept Name</th>
            <th>Dept Code</th>
            <th>Active Status</th>
          </tr>
        </thead>

        <tbody>
          {departments.map((dept) => (
            <tr key={dept._id}>
              <td>{dept.name}</td>
              <td>{dept.code}</td>
              <td>{dept.isActive ? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Departments;

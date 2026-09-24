import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function Departments() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await api.get("/departments");
        setDepartments(response.data.data);
      } catch (error) {
        console.error("Failed to load departments:", error);
      }
    };

    loadDepartments();
  }, []);

  return (
    <div>
      <Navbar />

      <h1>Departments</h1>

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

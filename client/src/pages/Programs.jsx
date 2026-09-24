import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function Programs() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const response = await api.get("/programs");
        setPrograms(response.data.data);
      } catch (error) {
        console.error("Failed to load programs:", error);
      }
    };

    loadPrograms();
  }, []);

  return (
    <div>
      <Navbar />

      <h1>Programs</h1>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Department</th>
            <th>Duration</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {programs.map((program) => (
            <tr key={program._id}>
              <td>{program.name}</td>
              <td>{program.code}</td>
              <td>{program.departmentId?.name || "N/A"}</td>
              <td>{program.durationYears} Years</td>
              <td>{program.isActive ? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Programs;

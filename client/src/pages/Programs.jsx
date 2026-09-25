import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function Programs() {
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [durationYears, setDurationYears] = useState("");

  const loadData = async () => {
    try {
      const [programsResponse, departmentsResponse] = await Promise.all([
        api.get("/programs"),
        api.get("/departments"),
      ]);

      setPrograms(programsResponse.data.data);
      setDepartments(departmentsResponse.data.data);
    } catch (error) {
      console.error("Failed to load programs:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createProgram = async (e) => {
    e.preventDefault();

    try {
      await api.post("/programs", {
        name,
        code,
        departmentId,
        durationYears: Number(durationYears),
      });

      alert("Program created successfully.");

      setName("");
      setCode("");
      setDepartmentId("");
      setDurationYears("");

      loadData();
    } catch (error) {
      console.error("Failed to create program:", error);
      alert("Failed to create program.");
    }
  };

  return (
    <div>
      <Navbar />

      <h1 className="page-heading">Programs</h1>

      <h2>Create Program</h2>

      <form onSubmit={createProgram}>
        <input
          type="text"
          placeholder="Program Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Program Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
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

        <input
          type="number"
          placeholder="Duration (Years)"
          value={durationYears}
          onChange={(e) => setDurationYears(e.target.value)}
          min="1"
          required
        />

        <button type="submit">Create Program</button>
      </form>

      <h2>Program List</h2>

      <div className="table-wrap">
        <table className="data-table">
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
    </div>
  );
}

export default Programs;

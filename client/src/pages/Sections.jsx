import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function Sections() {
  const [sections, setSections] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [name, setName] = useState("");
  const [programId, setProgramId] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [semester, setSemester] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  const loadData = async () => {
    try {
      const [sectionsResponse, programsResponse] = await Promise.all([
        api.get("/sections"),
        api.get("/programs"),
      ]);

      setSections(sectionsResponse.data.data);
      setPrograms(programsResponse.data.data);
    } catch (error) {
      console.error("Failed to load sections:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createSection = async (e) => {
    e.preventDefault();

    try {
      await api.post("/sections", {
        name,
        programId,
        batchYear: Number(batchYear),
        semester: Number(semester),
        academicYear,
      });

      alert("Section created successfully.");

      setName("");
      setProgramId("");
      setBatchYear("");
      setSemester("");
      setAcademicYear("");

      loadData();
    } catch (error) {
      console.error("Failed to create section:", error);
      alert("Failed to create section.");
    }
  };

  return (
    <div>
      <Navbar />

      <h1 className="page-heading">Sections</h1>

      <h2>Create Section</h2>

      <form onSubmit={createSection}>
        <input
          type="text"
          placeholder="Section Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={programId}
          onChange={(e) => setProgramId(e.target.value)}
          required
        >
          <option value="">Select Program</option>

          {programs.map((program) => (
            <option key={program._id} value={program._id}>
              {program.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Batch Year"
          value={batchYear}
          onChange={(e) => setBatchYear(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          min="1"
          required
        />

        <input
          type="text"
          placeholder="Academic Year (e.g. 2026-27)"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          required
        />

        <button type="submit">Create Section</button>
      </form>

      <h2>Section List</h2>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Program</th>
              <th>Batch Year</th>
              <th>Semester</th>
              <th>Academic Year</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {sections.map((section) => (
              <tr key={section._id}>
                <td>{section.name}</td>
                <td>{section.programId?.name || "N/A"}</td>
                <td>{section.batchYear}</td>
                <td>{section.semester}</td>
                <td>{section.academicYear}</td>
                <td>{section.isActive ? "Active" : "Inactive"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Sections;

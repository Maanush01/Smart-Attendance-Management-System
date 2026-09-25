import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [programId, setProgramId] = useState("");
  const [semester, setSemester] = useState("");
  const [credits, setCredits] = useState("");

  const loadData = async () => {
    try {
      const [subjectsResponse, programsResponse] = await Promise.all([
        api.get("/subjects"),
        api.get("/programs"),
      ]);

      setSubjects(subjectsResponse.data.data);
      setPrograms(programsResponse.data.data);
    } catch (error) {
      console.error("Failed to load subjects:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createSubject = async (e) => {
    e.preventDefault();

    try {
      await api.post("/subjects", {
        name,
        code,
        programId,
        semester: Number(semester),
        credits: Number(credits),
      });

      alert("Subject created successfully.");

      setName("");
      setCode("");
      setProgramId("");
      setSemester("");
      setCredits("");

      loadData();
    } catch (error) {
      console.error("Failed to create subject:", error);
      alert("Failed to create subject.");
    }
  };

  return (
    <div>
      <Navbar />

      <h1>Subjects</h1>

      <h2>Create Subject</h2>

      <form onSubmit={createSubject}>
        <input
          type="text"
          placeholder="Subject Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Subject Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
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
          placeholder="Semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          min="1"
          required
        />

        <input
          type="number"
          placeholder="Credits"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          min="0"
          required
        />

        <button type="submit">Create Subject</button>
      </form>

      <h2>Subject List</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Program</th>
            <th>Semester</th>
            <th>Credits</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((subject) => (
            <tr key={subject._id}>
              <td>{subject.name}</td>
              <td>{subject.code}</td>
              <td>{subject.programId?.name || "N/A"}</td>
              <td>{subject.semester}</td>
              <td>{subject.credits}</td>
              <td>{subject.isActive ? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Subjects;

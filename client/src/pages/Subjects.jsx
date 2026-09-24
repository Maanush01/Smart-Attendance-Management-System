import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function Subjects() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const response = await api.get("/subjects");
        setSubjects(response.data.data);
      } catch (error) {
        console.error("Failed to load subjects:", error);
      }
    };

    loadSubjects();
  }, []);

  return (
    <div>
      <Navbar />

      <h1>Subjects</h1>

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

import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function Sections() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const loadSections = async () => {
      try {
        const response = await api.get("/sections");
        setSections(response.data.data);
      } catch (error) {
        console.error("Failed to load sections:", error);
      }
    };

    loadSections();
  }, []);

  return (
    <div>
      <Navbar />

      <h1>Sections</h1>

      <table border="1">
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
  );
}

export default Sections;

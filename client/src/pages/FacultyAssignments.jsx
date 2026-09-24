import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function FacultyAssignments() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const response = await api.get("/faculty-assignments");
        setAssignments(response.data.data);
      } catch (error) {
        console.error("Failed to load faculty assignments:", error);
      }
    };

    loadAssignments();
  }, []);

  return (
    <div>
      <Navbar />

      <h1>Faculty Assignments</h1>

      <table border="1">
        <thead>
          <tr>
            <th>Faculty</th>
            <th>Subject</th>
            <th>Section</th>
            <th>Academic Year</th>
            <th>Semester</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment._id}>
              <td>{assignment.facultyId?.name || "N/A"}</td>
              <td>{assignment.subjectId?.name || "N/A"}</td>
              <td>{assignment.sectionId?.name || "N/A"}</td>
              <td>{assignment.academicYear}</td>
              <td>{assignment.semester}</td>
              <td>{assignment.isActive ? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FacultyAssignments;

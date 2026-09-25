import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function FacultyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);

  const [facultyId, setFacultyId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");

  const loadData = async () => {
    try {
      const [
        assignmentsResponse,
        facultyResponse,
        subjectsResponse,
        sectionsResponse,
      ] = await Promise.all([
        api.get("/faculty-assignments"),
        api.get("/faculty"),
        api.get("/subjects"),
        api.get("/sections"),
      ]);

      setAssignments(assignmentsResponse.data.data);
      setFaculty(facultyResponse.data.data);
      setSubjects(subjectsResponse.data.data);
      setSections(sectionsResponse.data.data);
    } catch (error) {
      console.error("Failed to load faculty assignments:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createAssignment = async (e) => {
    e.preventDefault();

    try {
      await api.post("/faculty-assignments", {
        facultyId,
        subjectId,
        sectionId,
        academicYear,
        semester: Number(semester),
      });

      alert("Faculty assignment created successfully.");

      setFacultyId("");
      setSubjectId("");
      setSectionId("");
      setAcademicYear("");
      setSemester("");

      loadData();
    } catch (error) {
      console.error("Failed to create assignment:", error);
      alert("Failed to create faculty assignment.");
    }
  };

  return (
    <div>
      <Navbar />

      <h1>Faculty Assignments</h1>

      <h2>Create Assignment</h2>

      <form onSubmit={createAssignment}>
        <select
          value={facultyId}
          onChange={(e) => setFacultyId(e.target.value)}
          required
        >
          <option value="">Select Faculty</option>

          {faculty.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>

        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          required
        >
          <option value="">Select Subject</option>

          {subjects.map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.name}
            </option>
          ))}
        </select>

        <select
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
          required
        >
          <option value="">Select Section</option>

          {sections.map((section) => (
            <option key={section._id} value={section._id}>
              {section.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Academic Year (e.g. 2026-27)"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
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

        <button type="submit">Create Assignment</button>
      </form>

      <h2>Assignment List</h2>

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

import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await api.get("/students");
        setStudents(response.data.data);
      } catch (error) {
        console.error("Failed to load students:", error);
      }
    };

    loadStudents();
  }, []);

  return (
    <div>
      <Navbar />

      <h1>Students</h1>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Register Number</th>
            <th>Admission Year</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.userId?.name}</td>
              <td>{student.rollNumber}</td>
              <td>{student.registerNumber}</td>
              <td>{student.admissionYear}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Students;

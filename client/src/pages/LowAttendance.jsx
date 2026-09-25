import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function LowAttendance() {
  const [students, setStudents] = useState([]);
  const [threshold, setThreshold] = useState(75);

  useEffect(() => {
    const loadLowAttendance = async () => {
      try {
        const response = await api.get("/attendance/low-attendance");

        setStudents(response.data.data);
        setThreshold(response.data.threshold);
      } catch (error) {
        console.error("Failed to load low attendance:", error);
      }
    };

    loadLowAttendance();
  }, []);

  return (
    <div>
      <Navbar />

      <h1 className="page-heading">Low Attendance</h1>

      <p>Students below {threshold}% attendance</p>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll Number</th>
              <th>Total Classes</th>
              <th>Present</th>
              <th>Attendance %</th>
            </tr>
          </thead>

          <tbody>
            {students.map((item) => (
              <tr key={item.student._id}>
                <td>{item.student.userId?.name || "N/A"}</td>
                <td>{item.student.rollNumber}</td>
                <td>{item.total}</td>
                <td>{item.present}</td>
                <td>{item.percentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LowAttendance;

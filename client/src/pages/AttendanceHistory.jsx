import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function AttendanceHistory() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const response = await api.get("/attendance/history");
        setRecords(response.data.data);
      } catch (error) {
        console.error("Failed to load attendance:", error);
      }
    };

    loadAttendance();
  }, []);

  return (
    <div>
      <Navbar />

      <h1 className="page-heading">Attendance History</h1>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
              <th>Marked By</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                <td>{record.studentId?.rollNumber || "N/A"}</td>
                <td>{record.sessionId?.subjectId?.name || "N/A"}</td>
                <td>
                  {record.sessionId?.date
                    ? new Date(record.sessionId.date).toISOString().slice(0, 10)
                    : "N/A"}
                </td>
                <td>{record.status}</td>
                <td>{record.markedBy?.name || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceHistory;

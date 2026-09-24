import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function StudentDashboard() {
  const [records, setRecords] = useState([]);
  const [requests, setRequests] = useState([]);

  const [selectedRecord, setSelectedRecord] = useState("");
  const [requestedStatus, setRequestedStatus] = useState("PRESENT");
  const [reason, setReason] = useState("");

  const [attendancePercentage, setAttendancePercentage] = useState(0);

  const loadData = async () => {
    try {
      const [attendanceResponse, correctionResponse] = await Promise.all([
        api.get("/attendance/history"),
        api.get("/corrections"),
      ]);

      const attendanceData = attendanceResponse.data.data;

      setRecords(attendanceData);
      setRequests(correctionResponse.data.data);

      if (attendanceData.length > 0) {
        const present = attendanceData.filter(
          (record) => record.status === "PRESENT" || record.status === "LATE",
        ).length;

        setAttendancePercentage((present / attendanceData.length) * 100);
      }
    } catch (error) {
      console.error("Student dashboard API failed:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitCorrection = async (e) => {
    e.preventDefault();

    if (!selectedRecord || !reason.trim()) {
      alert("Please select an attendance record and enter a reason.");
      return;
    }

    try {
      await api.post("/corrections", {
        attendanceRecordId: selectedRecord,
        requestedStatus,
        reason,
      });

      alert("Correction request submitted.");

      setSelectedRecord("");
      setRequestedStatus("PRESENT");
      setReason("");

      loadData();
    } catch (error) {
      console.error("Correction request failed:", error);
      alert("Failed to submit correction request.");
    }
  };

  return (
    <div>
      <Navbar />

      <h1>Student Dashboard</h1>

      <div>
        <h3>Attendance Percentage</h3>
        <p>{attendancePercentage.toFixed(2)}%</p>
      </div>

      <div>
        <h3>Total Classes</h3>
        <p>{records.length}</p>
      </div>

      <h2>Attendance History</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              <td>{record.sessionId?.subjectId?.name || "N/A"}</td>
              <td>
                {record.sessionId?.date
                  ? new Date(record.sessionId.date).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Request Attendance Correction</h2>

      <form onSubmit={submitCorrection}>
        <div>
          <label>Attendance Record: </label>

          <select
            value={selectedRecord}
            onChange={(e) => setSelectedRecord(e.target.value)}
          >
            <option value="">Select record</option>

            {records.map((record) => (
              <option key={record._id} value={record._id}>
                {record.sessionId?.subjectId?.name || "N/A"} -{" "}
                {record.sessionId?.date
                  ? new Date(record.sessionId.date).toLocaleDateString()
                  : "N/A"}{" "}
                - {record.status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Requested Status: </label>

          <select
            value={requestedStatus}
            onChange={(e) => setRequestedStatus(e.target.value)}
          >
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
            <option value="EXCUSED">Excused</option>
          </select>
        </div>

        <div>
          <label>Reason: </label>

          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason"
          />
        </div>

        <button type="submit">Submit Correction Request</button>
      </form>

      <h2>My Correction Requests</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Old Status</th>
            <th>Requested Status</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((request) => (
            <tr key={request._id}>
              <td>{request.oldStatus}</td>
              <td>{request.requestedStatus}</td>
              <td>{request.reason}</td>
              <td>{request.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentDashboard;

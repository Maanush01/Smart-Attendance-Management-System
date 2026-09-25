import { useEffect, useState } from "react";
import { CalendarCheck, ClipboardEdit, Percent } from "lucide-react";
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
          (record) => record.status === "PRESENT",
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
    <div className="page-shell">
      <Navbar />

      <main className="page-content">
        <p className="eyebrow">Personal attendance</p>
        <h1
          className="page-heading"
          style={{ display: "flex", alignItems: "center", gap: ".65rem" }}
        >
          <CalendarCheck size={24} color="#3157a6" />
          Student Dashboard
        </h1>

        <div className="stat-grid">
          <div className="stat-card">
            <h3>
              <Percent
                size={17}
                style={{
                  verticalAlign: "middle",
                  marginRight: ".4rem",
                  color: "#15803d",
                }}
              />
              Attendance Percentage
            </h3>
            <p>{attendancePercentage.toFixed(2)}%</p>
          </div>

          <div className="stat-card">
            <h3>
              <CalendarCheck
                size={17}
                style={{
                  verticalAlign: "middle",
                  marginRight: ".4rem",
                  color: "#3157a6",
                }}
              />
              Total Classes
            </h3>
            <p>{records.length}</p>
          </div>
        </div>

        <section
          className="content-card"
          style={{ marginBottom: "1.5rem", overflow: "hidden" }}
        >
          <h2
            style={{
              padding: "1.25rem 1.25rem 0",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            <CalendarCheck size={19} color="#3157a6" />
            Attendance History
          </h2>

          <div className="table-wrap" style={{ border: 0, boxShadow: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      No attendance records yet.
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record._id}>
                      <td>{record.sessionId?.subjectId?.name || "N/A"}</td>
                      <td>
                        {record.sessionId?.date
                          ? new Date(record.sessionId.date)
                              .toISOString()
                              .slice(0, 10)
                          : "N/A"}
                      </td>
                      <td>
                        <span
                          className={`badge badge-${record.status.toLowerCase()}`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section
          className="content-card"
          style={{ padding: "1.25rem", marginBottom: "1.5rem" }}
        >
          <h2
            style={{
              margin: "0 0 1rem",
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            <ClipboardEdit size={19} color="#3157a6" />
            Request Attendance Correction
          </h2>

          <form className="form-stack" onSubmit={submitCorrection}>
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
                      ? new Date(record.sessionId.date)
                          .toISOString()
                          .slice(0, 10)
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

            <button className="button" type="submit">
              Submit Correction Request
            </button>
          </form>
        </section>

        <section className="content-card" style={{ overflow: "hidden" }}>
          <h2
            style={{
              padding: "1.25rem 1.25rem 0",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            <ClipboardEdit size={19} color="#3157a6" />
            My Correction Requests
          </h2>

          <div className="table-wrap" style={{ border: 0, boxShadow: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Old Status</th>
                  <th>Requested Status</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      No correction requests yet.
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.oldStatus}</td>
                      <td>{request.requestedStatus}</td>
                      <td>{request.reason}</td>
                      <td>
                        <span
                          className={`badge badge-${request.status.toLowerCase()}`}
                        >
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;

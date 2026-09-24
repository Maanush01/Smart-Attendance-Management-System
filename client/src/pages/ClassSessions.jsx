import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function ClassSessions() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await api.get("/class-sessions");
        setSessions(response.data.data);
      } catch (error) {
        console.error("Failed to load class sessions:", error);
      }
    };

    loadSessions();
  }, []);

  return (
    <div>
      <Navbar />

      <h1>Class Sessions</h1>

      <table border="1">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Section</th>
            <th>Faculty</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {sessions.map((session) => (
            <tr key={session._id}>
              <td>{session.subjectId?.name || "N/A"}</td>
              <td>{session.sectionId?.name || "N/A"}</td>
              <td>{session.facultyId?.name || "N/A"}</td>
              <td>{new Date(session.date).toLocaleDateString()}</td>
              <td>{session.startTime}</td>
              <td>{session.endTime}</td>
              <td>{session.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClassSessions;

import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function ClassSessions() {
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendance, setAttendance] = useState({});

  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [faculty, setFaculty] = useState([]);

  const [subjectId, setSubjectId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    loadSessions();

    if (isAdmin) {
      loadFormData();
    }
  }, []);

  const loadSessions = async () => {
    try {
      const response = await api.get("/class-sessions");
      setSessions(response.data.data);
    } catch (error) {
      console.error("Failed to load class sessions:", error);
    }
  };

  const loadFormData = async () => {
    try {
      const [subjectsResponse, sectionsResponse, facultyResponse] =
        await Promise.all([
          api.get("/subjects"),
          api.get("/sections"),
          api.get("/faculty"),
        ]);

      setSubjects(subjectsResponse.data.data);
      setSections(sectionsResponse.data.data);
      setFaculty(facultyResponse.data.data);
    } catch (error) {
      console.error("Failed to load session form data:", error);
    }
  };

  const createSession = async (e) => {
    e.preventDefault();

    try {
      await api.post("/class-sessions", {
        subjectId,
        sectionId,
        facultyId,
        date,
        startTime,
        endTime,
      });

      alert("Class session created successfully.");

      setSubjectId("");
      setSectionId("");
      setFacultyId("");
      setDate("");
      setStartTime("");
      setEndTime("");

      loadSessions();
    } catch (error) {
      console.error("Failed to create class session:", error);
      alert("Failed to create class session.");
    }
  };

  const openAttendance = async (session) => {
    try {
      const response = await api.get("/students");

      setStudents(response.data.data);
      setSelectedSession(session);

      const initialAttendance = {};

      response.data.data.forEach((student) => {
        initialAttendance[student._id] = "PRESENT";
      });

      setAttendance(initialAttendance);
    } catch (error) {
      console.error("Failed to load students:", error);
    }
  };

  const updateAttendance = (studentId, status) => {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));
  };

  const submitAttendance = async () => {
    try {
      const attendanceData = students.map((student) => ({
        studentId: student._id,
        status: attendance[student._id],
      }));

      await api.post(`/attendance/sessions/${selectedSession._id}`, {
        attendance: attendanceData,
      });

      alert("Attendance submitted successfully.");

      setSelectedSession(null);
      setStudents([]);
      setAttendance({});
    } catch (error) {
      console.error("Failed to submit attendance:", error);
      alert("Failed to submit attendance.");
    }
  };

  return (
    <div>
      <Navbar />

      <h1>Class Sessions</h1>

      {isAdmin && (
        <div>
          <h2>Create Class Session</h2>

          <form onSubmit={createSession}>
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

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />

            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />

            <button type="submit">Create Session</button>
          </form>
        </div>
      )}

      <h2>Session List</h2>

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
            <th>Action</th>
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

              <td>
                {user?.role === "FACULTY" && (
                  <button onClick={() => openAttendance(session)}>
                    Mark Attendance
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedSession && (
        <div>
          <h2>
            Mark Attendance - {selectedSession.subjectId?.name || "Session"}
          </h2>

          <table border="1">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll Number</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.userId?.name || "N/A"}</td>
                  <td>{student.rollNumber}</td>

                  <td>
                    <select
                      value={attendance[student._id]}
                      onChange={(e) =>
                        updateAttendance(student._id, e.target.value)
                      }
                    >
                      <option value="PRESENT">Present</option>
                      <option value="ABSENT">Absent</option>
                      <option value="LATE">Late</option>
                      <option value="EXCUSED">Excused</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={submitAttendance}>Submit Attendance</button>

          <button onClick={() => setSelectedSession(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default ClassSessions;

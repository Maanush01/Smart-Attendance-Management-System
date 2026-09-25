import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function Students() {
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [sections, setSections] = useState([]);

  // Student user form
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  // Student profile form
  const [userId, setUserId] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [programId, setProgramId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [admissionYear, setAdmissionYear] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";

  const loadData = async () => {
    try {
      const responses = await Promise.all([
        api.get("/students"),
        api.get("/programs"),
        api.get("/sections"),
        api.get("/auth/users"),
      ]);

      setStudents(responses[0].data.data);
      setPrograms(responses[1].data.data);
      setSections(responses[2].data.data);
      setUsers(responses[3].data.data);
    } catch (error) {
      console.error("Failed to load student data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createStudentUser = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/users", {
        name: userName,
        email: userEmail,
        password: userPassword,
        role: "STUDENT",
      });

      alert("Student user created successfully.");

      setUserName("");
      setUserEmail("");
      setUserPassword("");

      // Automatically select the newly created user
      setUserId(response.data.data.id);

      loadData();
    } catch (error) {
      console.error("Failed to create student user:", error);

      alert(error.response?.data?.message || "Failed to create student user.");
    }
  };

  const createStudent = async (e) => {
    e.preventDefault();

    try {
      await api.post("/students", {
        userId,
        rollNumber,
        registerNumber,
        programId,
        sectionId,
        admissionYear: Number(admissionYear),
      });

      alert("Student profile created successfully.");

      setUserId("");
      setRollNumber("");
      setRegisterNumber("");
      setProgramId("");
      setSectionId("");
      setAdmissionYear("");

      loadData();
    } catch (error) {
      console.error("Failed to create student:", error);

      alert(error.response?.data?.message || "Failed to create student.");
    }
  };

  return (
    <div>
      <Navbar />

      <h1>Students</h1>

      {isAdmin && (
        <div>
          <h2>Create Student User</h2>

          <form onSubmit={createStudentUser}>
            <input
              type="text"
              placeholder="Student Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Student Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />

            <button type="submit">Create Student User</button>
          </form>

          <h2>Create Student Profile</h2>

          <form onSubmit={createStudent}>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            >
              <option value="">Select Student User</option>

              {users.map((studentUser) => (
                <option key={studentUser._id} value={studentUser._id}>
                  {studentUser.name} - {studentUser.email}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Roll Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Register Number"
              value={registerNumber}
              onChange={(e) => setRegisterNumber(e.target.value)}
            />

            <select
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              required
            >
              <option value="">Select Program</option>

              {programs.map((program) => (
                <option key={program._id} value={program._id}>
                  {program.name}
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
              type="number"
              placeholder="Admission Year"
              value={admissionYear}
              onChange={(e) => setAdmissionYear(e.target.value)}
              required
            />

            <button type="submit">Create Student Profile</button>
          </form>
        </div>
      )}

      <h2>Student List</h2>

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
              <td>{student.userId?.name || "N/A"}</td>
              <td>{student.rollNumber}</td>
              <td>{student.registerNumber || "N/A"}</td>
              <td>{student.admissionYear}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Students;

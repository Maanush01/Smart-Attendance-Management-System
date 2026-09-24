import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function Faculty() {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    const loadFaculty = async () => {
      try {
        const response = await api.get("/faculty");
        setFaculty(response.data.data);
      } catch (error) {
        console.error("Failed to load faculty:", error);
      }
    };

    loadFaculty();
  }, []);

  return (
    <div>
      <Navbar />

      <h1>Faculty</h1>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {faculty.map((member) => (
            <tr key={member._id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.isActive ? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Faculty;

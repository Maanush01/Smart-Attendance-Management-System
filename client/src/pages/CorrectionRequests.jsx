import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function CorrectionRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response = await api.get("/corrections");
        setRequests(response.data.data);
      } catch (error) {
        console.error("Failed to load correction requests:", error);
      }
    };

    loadRequests();
  }, []);

  return (
    <div>
      <Navbar />

      <h1>Correction Requests</h1>

      <table border="1">
        <thead>
          <tr>
            <th>Student</th>
            <th>Old Status</th>
            <th>Requested Status</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((request) => (
            <tr key={request._id}>
              <td>{request.requestedBy?.name || "N/A"}</td>
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

const getCorrectionRequests = async (req, res) => {
  try {
    const requests = await CorrectionRequest.find()
      .populate("requestedBy", "name email")
      .populate("reviewedBy", "name email")
      .populate("attendanceRecordId");

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default CorrectionRequests;

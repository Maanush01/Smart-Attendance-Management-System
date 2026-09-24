import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function CorrectionRequests() {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    try {
      const response = await api.get("/corrections");
      setRequests(response.data.data);
    } catch (error) {
      console.error("Failed to load correction requests:", error);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const reviewRequest = async (id, status) => {
    try {
      await api.patch(`/corrections/${id}/review`, {
        status,
        reviewComment: "",
      });

      alert(`Request ${status.toLowerCase()}.`);
      loadRequests();
    } catch (error) {
      console.error("Failed to review correction:", error);
      alert("Failed to review correction request.");
    }
  };

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
            <th>Action</th>
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

              <td>
                {request.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => reviewRequest(request._id, "APPROVED")}
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => reviewRequest(request._id, "REJECTED")}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CorrectionRequests;

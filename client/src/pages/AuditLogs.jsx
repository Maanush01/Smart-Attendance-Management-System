import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useEffect, useState } from "react";

function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const response = await api.get("/audit-logs");
        setLogs(response.data.data);
      } catch (error) {
        console.error("Failed to load audit logs:", error);
      }
    };

    loadLogs();
  }, []);

  return (
    <div>
      <Navbar />

      <h1 className="page-heading">Audit Logs</h1>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Entity</th>
              <th>Actor</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{log.action}</td>
                <td>{log.entityType}</td>
                <td>{log.actorId?.name || "N/A"}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLogs;

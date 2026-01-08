import { useEffect, useState } from "react";
import { formatIST } from "../utils/time"; // ✅ UTC → IST formatter

export default function ViewTicketModal({ ticketId, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/user/ticket/${ticketId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not authorized or ticket not found");
        return res.json();
      })
      .then(setData)
      .catch(() => setData(null));
  }, [ticketId]);

  if (!data) return null;

  return (
    <>
      <style>{`
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          width: 700px;
          max-height: 85vh;
          overflow-y: auto;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 35px 90px rgba(0,0,0,0.3);
          animation: pop 0.3s ease;
        }

        @keyframes pop {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        h2 {
          margin-bottom: 16px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px 20px;
          font-size: 14px;
        }

        .section {
          margin-top: 20px;
        }

        .box {
          background: #f1f5f9;
          padding: 14px;
          border-radius: 10px;
          margin-top: 6px;
          font-size: 14px;
          color: #334155;

          white-space: pre-wrap;
          word-break: break-word;
          overflow-wrap: anywhere;

          max-height: 160px;
          overflow-y: auto;
        }

        .footer {
          margin-top: 24px;
          text-align: right;
        }

        button {
          padding: 8px 18px;
          border-radius: 8px;
          border: none;
          background: #6366f1;
          color: white;
          cursor: pointer;
        }

        button:hover {
          background: #4f46e5;
        }

        @media (max-width: 768px) {
          .modal {
            width: 95%;
            padding: 20px;
          }

          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="overlay">
        <div className="modal">
          <h2>Ticket Resolution Details</h2>

          <div className="grid">
            <div><b>Ticket ID:</b> {data.ticketId}</div>
            <div><b>User ID:</b> {data.userId}</div>

            {/* ✅ UTC → IST */}
            <div>
              <b>Created Time:</b>{" "}
              {formatIST(data.createdAt)}
            </div>

            <div>
              <b>Resolved Time:</b>{" "}
              {data.resolvedAt ? formatIST(data.resolvedAt) : "—"}
            </div>

            <div><b>Priority:</b> {data.priority}</div>
            <div>
              <b>Agent:</b>{" "}
              {data.agentName
                ? `${data.agentName} (ID: ${data.agentId})`
                : "—"}
            </div>
          </div>

          <div className="section">
            <b>Issue</b>
            <div className="box">{data.issue || "—"}</div>
          </div>

          <div className="section">
            <b>Agent Notes</b>
            <div className="box">{data.resolutionNote || "—"}</div>
          </div>

          <div className="footer">
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </>
  );
}

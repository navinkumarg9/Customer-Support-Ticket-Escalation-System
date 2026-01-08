import { useEffect, useState } from "react";
import TopBar from "../../components/TopBar";
import { formatIST } from "../../utils/time"; // ✅ UTC → IST

export default function AgentDashboard() {
  const agent = JSON.parse(localStorage.getItem("user"));
  const [ticket, setTicket] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* 🔹 LOAD ASSIGNED TICKET */
  useEffect(() => {
    if (!agent?.id) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/agent/ticket/${agent.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load ticket");
        return res.json();
      })
      .then(setTicket)
      .catch(err => {
        console.error(err);
        setTicket(null);
      });
  }, [agent?.id]);

  /* 🔹 START WORK */
  const startWork = async () => {
    if (!ticket) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/agent/start/${ticket.id}?agentId=${agent.id}`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Failed to start work");

      const updated = await res.json();
      setTicket(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 RESOLVE TICKET */
  const resolve = async () => {
    if (!note.trim()) {
      alert("Resolution notes are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/agent/resolve/${ticket.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentId: agent.id,
            note: note
          })
        }
      );

      if (!res.ok) throw new Error("Failed to resolve ticket");

      const updated = await res.json();
      setTicket(updated);
      setNote("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .agent-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #eef2ff, #f8fafc);
          padding: 40px;
          font-family: 'Segoe UI', sans-serif;
        }

        .ticket-card {
          max-width: 680px;
          margin-top: 30px;
          background: white;
          padding: 26px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ticket-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ticket-id {
          font-weight: 700;
          font-size: 16px;
          color: #334155;
        }

        .status {
          font-size: 12px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 999px;
          color: white;
        }

        .OPEN { background: #0ea5e9; }
        .PENDING { background: #f59e0b; }
        .IN_PROGRESS { background: #6366f1; }
        .RESOLVED { background: #22c55e; }
        .ESCALATED { background: #ef4444; }

        .issue {
          margin: 18px 0;
          font-size: 16px;
          color: #334155;
        }

        .half-line {
          max-width: 420px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #64748b;
          margin-bottom: 18px;
        }

        textarea {
          width: 100%;
          min-height: 110px;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #c7d2fe;
          margin-bottom: 14px;
          resize: vertical;
          font-family: inherit;
        }

        textarea:focus {
          outline: none;
          border-color: #6366f1;
        }

        .btn {
          padding: 10px 16px;
          border-radius: 10px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
        }

        .btn-success {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .empty {
          margin-top: 80px;
          text-align: center;
          color: #64748b;
        }

        .error {
          margin-bottom: 12px;
          color: #ef4444;
          font-weight: 600;
        }
      `}</style>

      <div className="agent-page">
        <TopBar
          title="Agent Workspace"
          subtitle={`Welcome, ${agent?.fullName || "Agent"}`}
        />

        {!ticket && (
          <div className="empty">
            <h2>No ticket assigned</h2>
            <p>Please wait for admin assignment</p>
          </div>
        )}

        {ticket && (
          <div className="ticket-card">
            <div className="ticket-row">
              <span className="ticket-id">{ticket.ticketId}</span>
              <span className={`status ${ticket.status || "OPEN"}`}>
                {typeof ticket.status === "string"
                  ? ticket.status.replace("_", " ")
                  : "UNKNOWN"}
              </span>
            </div>

            <p className="issue half-line" title={ticket.issue}>
              {ticket.issue}
            </p>

            <div className="meta">
              <span><b>Priority:</b> {ticket.priority}</span>
              <span>
                <b>Created:</b>{" "}
                {ticket.createdAt ? formatIST(ticket.createdAt) : "—"}
              </span>
            </div>

            {error && <div className="error">{error}</div>}

            {ticket.status === "PENDING" && (
              <button
                className="btn btn-primary"
                onClick={startWork}
                disabled={loading}
              >
                ▶ Start Work
              </button>
            )}

            {ticket.status === "IN_PROGRESS" && (
              <>
                <textarea
                  placeholder="Describe how you resolved the issue..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
                <button
                  className="btn btn-success"
                  onClick={resolve}
                  disabled={loading}
                >
                  ✔ Resolve Ticket
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

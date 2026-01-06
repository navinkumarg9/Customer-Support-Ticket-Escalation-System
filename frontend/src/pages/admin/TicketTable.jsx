import { useEffect, useState } from "react";

function getRemaining(deadline, status) {
  if (status === "RESOLVED") {
    return { text: "—", expired: false };
  }

  if (!deadline) return { text: "—", expired: false };

  const diff = new Date(deadline) - new Date();
  if (diff <= 0) return { text: "Expired", expired: true };

  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff / (1000 * 60)) % 60);
  return { text: `${h}h ${m}m`, expired: false };
}

export default function TicketTable({
  tickets = [],              // ✅ SAFE DEFAULT
  activeFilter = "ALL",       // ✅ SAFE DEFAULT (FIX)
  onAssign,
  onView,
}) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => forceUpdate(v => v + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  // ✅ SAFE EMPTY MESSAGE
  const getEmptyMessage = () => {
    if (!activeFilter || activeFilter === "ALL") {
      return "No tickets available";
    }
    return `No ${activeFilter.replace("_", " ")} tickets found`;
  };

  const renderAction = (t, escalated) => {
    if (t.status === "RESOLVED") {
      return (
        <button className="view-btn" onClick={() => onView(t)}>
          View
        </button>
      );
    }

    if (escalated) {
      return (
        <button className="reassign-btn" onClick={() => onAssign(t)}>
          Reassign
        </button>
      );
    }

    if (t.status === "OPEN") {
      return <button onClick={() => onAssign(t)}>Assign</button>;
    }

    if (t.status === "PENDING" || t.status === "IN_PROGRESS") {
      return <span className="assigned">Assigned</span>;
    }

    return <span className="muted">—</span>;
  };

  return (
    <div className="table-wrapper">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Ticket</th>
              <th>User</th>
              <th>Issue</th>
              <th>Priority</th>
              <th>Status</th>
              <th>SLA</th>
              <th>Remaining</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty">
                  {getEmptyMessage()}
                </td>
              </tr>
            ) : (
              tickets.map(t => {
                const sla = getRemaining(t.slaDeadline, t.status);
                const escalated = t.status === "ESCALATED" || sla.expired;
                const displayStatus = escalated ? "ESCALATED" : t.status;

                return (
                  <tr key={t.id} className={escalated ? "escalated" : ""}>
                    <td>{t.ticketId}</td>
                    <td>{t.userId}</td>

                    <td className="half-line" title={t.issue}>
                      {t.issue}
                    </td>

                    <td>
                      <span className={`chip ${t.priority.toLowerCase()}`}>
                        {t.priority}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status ${displayStatus
                          .toLowerCase()
                          .replace("_", "-")}`}
                      >
                        {displayStatus}
                      </span>
                    </td>

                    <td>{t.slaDeadline ? new Date(t.slaDeadline).toLocaleString() : "—"}</td>

                    <td className={sla.expired ? "expired" : "active"}>
                      {t.status === "RESOLVED" ? "—" : sla.text}
                    </td>

                    <td>{renderAction(t, escalated)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 INTERNAL CSS */}
      <style>{`
        .table-wrapper {
          background: white;
          border-radius: 14px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        /* ✅ ONLY TABLE SCROLLS */
        .table-scroll {
          max-height: 60vh;
          overflow-y: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: linear-gradient(135deg, #eef2ff, #f8fafc);
          padding: 14px;
          font-size: 13px;
          text-transform: uppercase;
          color: #475569;

          /* ✅ STICKY HEADER */
          position: sticky;
          top: 0;
          z-index: 5;
        }

        td {
          padding: 14px;
          border-bottom: 1px solid #e5e7eb;
        }

        tr:hover {
          background: #f8fafc;
        }

        tr.escalated {
          background: #fff1f2;
        }

        .empty {
          text-align: center;
          padding: 45px;
          font-size: 15px;
          font-weight: 600;
          color: #64748b;
          background: #f8fafc;
        }

        .chip {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 530;
        }
        .chip.high { background: #fee2e2; color: #991b1b; }
        .chip.medium { background: #fef3c7; color: #92400e; }
        .chip.low { background: #dcfce7; color: #166534; }

        .status{
          font-size: 12px;
          font-weight: 550;          
        }
        .status.open { color: #2563eb; }
        .status.pending { color:  #f59e0b; }
        .status.in-progress { color: #7c3aed; }
        .status.resolved { color: #16a34a; }
        .status.escalated { color: #dc2626; }

        .expired {
          color: #dc2626;
          font-weight: 600;
        }

        .active {
          color: #16a34a;
          font-weight: 600;
        }

        .assigned {
          font-size: 12px;
          font-weight: 700;
          color: #9333ea;
        }

        .muted {
          color: #94a3b8;
          font-weight: 600;
        }

        button {
          padding: 8px 12px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          cursor: pointer;
        }
        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        .view-btn {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
        }
        .view-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }
        .reassign-btn {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
        }
        .reassign-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        .half-line {
          max-width: 220px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        

      `}</style>
    </div>
  );
}

import { useEffect, useState } from "react";
import CreateTicketModal from "./CreateTicketModal";
import ViewTicketModal from "../../components/ViewTicketModal";
import TopBar from "../../components/TopBar";

export default function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [viewTicketId, setViewTicketId] = useState(null);

  // 🔹 PAGINATION STATE
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <h3>Please login again</h3>;

  // 🔹 LOAD TICKETS (PAGINATED)
  const loadTickets = async (pageNumber = page) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tickets/my/${user.id}?page=${pageNumber}&size=10`
      );

      if (!res.ok) throw new Error("Failed to load tickets");

      const data = await res.json();

      setTickets(data.content || []);
      setPage(data.number);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 INITIAL LOAD + AUTO REFRESH (same page)
  useEffect(() => {
  loadTickets(page);

  const interval = setInterval(() => {
    loadTickets(page);
  }, 30000);

  return () => clearInterval(interval);
}, [page]); // ✅ page added


  return (
    <>
      <style>{`
        .page {
          padding: 30px;
          background: #f1f5f9;
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
        }

        .section {
          background: white;
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.08);
          padding: 22px;
          margin-top: 20px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h2 {
          margin: 0;
          font-size: 20px;
          color: #1e293b;
        }

        .create-btn {
          padding: 10px 18px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
        }

        .table-scroll {
          max-height: 60vh;
          overflow-y: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          padding: 14px;
          font-size: 13px;
          text-transform: uppercase;
          color: white;
          background: #292b2b;
          position: sticky;
          top: 0;
        }

        td {
          padding: 14px;
          border-bottom: 1px solid #e5e7eb;
        }

        .issue-cell {
          max-width: 420px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .status {
          font-size: 13px;
          font-weight: 650;
          text-transform: uppercase;
        }

        .OPEN { color: #0ea5e9; }
        .PENDING { color: #f59e0b; }
        .IN_PROGRESS { color: #6366f1; }
        .RESOLVED { color: #22c55e; }
        .ESCALATED { color: #ef4444; }

        .priority-badge {
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 650;
        }

        .priority-LOW { background: #dcfce7; color: #166534; }
        .priority-MEDIUM { background: #fef3c7; color: #92400e; }
        .priority-HIGH { background: #fee2e2; color: #991b1b; }

        .view-btn {
          padding: 8px 14px;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        /* ✅ FIX pagination gap */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 14px;
          margin: 12px 0 0;
          padding-bottom: 8px;
        }

        .pagination button {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          background: #6366f1;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .pagination button:disabled {
          background: #c7d2fe;
          cursor: not-allowed;
        }
      `}</style>

      <div className="page">
        <TopBar
          title={`Welcome, ${user.fullName}`}
          subtitle={`User ID: ${user.id}`}
        />

        <div className="section">
          <div className="section-header">
            <h2>My Tickets</h2>
            <button className="create-btn" onClick={() => setShowForm(true)}>
              + Create Ticket
            </button>
          </div>

          {tickets.length === 0 ? (
            <p>No tickets found</p>
          ) : (
            <>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Issue</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(t => (
                      <tr key={t.id}>
                        <td>{t.ticketId}</td>
                        <td className="issue-cell" title={t.issue}>
                          {t.issue}
                        </td>
                        <td>
                          <span className={`priority-badge priority-${t.priority}`}>
                            {t.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`status ${t.status}`}>
                            {t.status.replace("_", " ")}
                          </span>
                        </td>
                        <td>
                          {t.status === "RESOLVED" ? (
                            <button
                              className="view-btn"
                              onClick={() => setViewTicketId(t.id)}
                            >
                              View
                            </button>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </>
          )}
        </div>

        {showForm && (
          <CreateTicketModal
            onClose={() => setShowForm(false)}
            onTicketCreated={() => loadTickets(0)}
          />
        )}

        {viewTicketId && (
          <ViewTicketModal
            ticketId={viewTicketId}
            onClose={() => setViewTicketId(null)}
          />
        )}
        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              ⬅ Previous
            </button>
            <span>Page {page + 1} of {totalPages}</span>
            <button
              disabled={page + 1 === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next ➡
            </button>
          </div>
        )}
        
      </div>
    </>
  );
}

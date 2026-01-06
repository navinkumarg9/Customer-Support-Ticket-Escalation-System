import { useEffect, useState } from "react";
import DashboardStats from "./DashboardStats";
import TicketTable from "./TicketTable";
import AssignAgentModal from "./AssignAgentModal";
import ViewTicketModal from "../../components/ViewTicketModal";
import api from "../../api/api";
import TopBar from "../../components/TopBar";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [counts, setCounts] = useState(null);

  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 10;

  const [assignTicket, setAssignTicket] = useState(null);
  const [viewTicketId, setViewTicketId] = useState(null);

  useEffect(() => {
    fetchTickets(page, filter);
  }, [page, filter]);

  useEffect(() => {
    fetchAgents();
    fetchDashboardCounts();
  }, []);

  const fetchTickets = async (pageNo, activeFilter) => {
    const res = await api.get("/admin/tickets", {
      params: {
        page: pageNo,
        size,
        status: activeFilter === "ALL" ? null : activeFilter,
      },
    });

    setTickets(res.data.content);
    setTotalPages(res.data.totalPages);
  };

  const fetchDashboardCounts = async () => {
    const res = await api.get("/admin/dashboard-counts");
    setCounts(res.data);
  };

  const fetchAgents = async () => {
    const res = await api.get("/admin/agents");
    setAgents(res.data);
  };

  const handleAssign = async (ticket, agent) => {
    await api.post("/admin/assign", {
      ticketId: ticket.id,
      agentId: agent.id,
    });

    setAssignTicket(null);
    fetchTickets(page, filter);
    fetchAgents();
    fetchDashboardCounts();
  };

  return (
    <>
      <style>{`
        .admin-container {
          padding: 24px;
          background: #f5f7fb;
          font-family: Arial, sans-serif;

          /* ✅ FIX: remove forced empty space */
          min-height: calc(100vh - 60px);
          box-sizing: border-box;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .admin-header h1 {
          margin: 0;
        }

        .admin-header p {
          margin: 4px 0 0;
          color: #666;
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

      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Admin Control Center</h1>
            <p>Monitor tickets, SLA & agent workload</p>
          </div>
          <TopBar />
        </div>

        <DashboardStats
          counts={counts}
          activeFilter={filter}
          onFilterChange={(f) => {
            setFilter(f);
            setPage(0);
          }}
        />

        <TicketTable
          tickets={tickets}
          onAssign={setAssignTicket}
          onView={(t) => setViewTicketId(t.id)}
        />

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              ⬅ Previous
            </button>

            <span>
              Page {page + 1} of {totalPages}
            </span>

            <button
              disabled={page + 1 === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next ➡
            </button>
          </div>
        )}

        {assignTicket && (
          <AssignAgentModal
            ticket={assignTicket}
            agents={agents}
            onAssign={handleAssign}
            onClose={() => setAssignTicket(null)}
          />
        )}

        {viewTicketId && (
          <ViewTicketModal
            ticketId={viewTicketId}
            onClose={() => setViewTicketId(null)}
          />
        )}
      </div>
    </>
  );
}

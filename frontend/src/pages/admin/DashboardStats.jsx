export default function DashboardStats({
  counts,
  onFilterChange,
  activeFilter,
}) {
  if (!counts) return null;

  return (
    <>
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
          margin-bottom: 25px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 14px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
          cursor: pointer;
          text-align: center;
          border: 2px solid transparent;
          transition: 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-3px);
        }

        .stat-card.active {
          border-color: #2563eb;
          background: #eef2ff;
        }

        .stat-card h4 {
          margin: 0;
          font-size: 14px;
          color: #555;
        }

        .stat-card h2 {
          margin-top: 10px;
          font-size: 28px;
          font-weight: 700;
        }

        .danger {
          background: #fff1f2;
        }
      `}</style>

      <div className="stats-grid">
        <Stat title="Total Tickets" value={counts.TOTAL} active={activeFilter === "ALL"} onClick={() => onFilterChange("ALL")} />
        <Stat title="Open" value={counts.OPEN} active={activeFilter === "OPEN"} onClick={() => onFilterChange("OPEN")} />
        <Stat title="Pending" value={counts.PENDING} active={activeFilter === "PENDING"} onClick={() => onFilterChange("PENDING")} />
        <Stat title="In Progress" value={counts.IN_PROGRESS} active={activeFilter === "IN_PROGRESS"} onClick={() => onFilterChange("IN_PROGRESS")} />
        <Stat title="Resolved" value={counts.RESOLVED} active={activeFilter === "RESOLVED"} onClick={() => onFilterChange("RESOLVED")} />
        <Stat title="Escalated" value={counts.ESCALATED} danger active={activeFilter === "ESCALATED"} onClick={() => onFilterChange("ESCALATED")} />
      </div>
    </>
  );
}

function Stat({ title, value, onClick, danger, active }) {
  return (
    <div className={`stat-card ${danger ? "danger" : ""} ${active ? "active" : ""}`} onClick={onClick}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

import { useState } from "react";

export default function AssignAgentModal({ ticket, agents, onAssign, onClose }) {
  const [selectedAgent, setSelectedAgent] = useState(null);

  return (
    <>
      <div className="overlay">
        <div className="modal">
          {/* HEADER */}
          <header>
            <h2>Assign Agent</h2>
            <span className="close" onClick={onClose}>×</span>
          </header>

          {/* TICKET CONTEXT */}
          <div className="ticket-box">
            <div className="ticket-id">
              Ticket: <b>{ticket.ticketId}</b>
            </div>

            <div className="issue-label">ISSUE</div>

            {/* 🔥 ISSUE NOW EXPANDS */}
            <div className="issue-text">
              {ticket.issue}
            </div>
          </div>

          {/* AGENT LIST */}
          <div className="agent-grid">
            {agents.map(agent => (
              <div
                key={agent.id}
                className={`agent-card 
                  ${agent.busy ? "disabled" : ""} 
                  ${selectedAgent?.id === agent.id ? "selected" : ""}`}
                onClick={() => !agent.busy && setSelectedAgent(agent)}
              >
                <h4>{agent.name}</h4>
                <p className="email">{agent.email}</p>

                {agent.busy ? (
                  <span className="busy">Busy</span>
                ) : (
                  <span className="free">Free</span>
                )}
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <footer>
            <button className="cancel" onClick={onClose}>
              Cancel
            </button>

            <button
              className="assign"
              disabled={!selectedAgent}
              onClick={() => onAssign(ticket, selectedAgent)}
            >
              Assign Agent
            </button>
          </footer>
        </div>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }

        .modal {
          width: 720px;
          max-width: 95%;
          max-height: 85vh;
          background: white;
          border-radius: 20px;
          box-shadow: 0 25px 70px rgba(0,0,0,0.25);
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        h2 {
          margin: 0;
          font-size: 22px;
          color: #0f172a;
        }

        .close {
          font-size: 26px;
          cursor: pointer;
          color: #64748b;
        }

        /* 🔥 TICKET BOX */
        .ticket-box {
          background: #f8fafc;
          border-radius: 14px;
          padding: 14px 16px;
          margin: 14px 0 18px;
        }

        .ticket-id {
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 6px;
        }

        .issue-label {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 6px;
        }

        /* ✅ EXPANDABLE ISSUE TEXT */
        .issue-text {
          font-size: 14px;
          color: #334155;
          line-height: 1.6;
          white-space: normal;     /* allow wrapping */
          word-break: break-word;
          max-height: 140px;       /* prevents modal overflow */
          overflow-y: auto;        /* scroll if very long */
          padding-right: 6px;
        }

        /* 🔥 AGENTS */
        .agent-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 16px;
          max-height: 320px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .agent-card {
          border-radius: 14px;
          padding: 16px;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.25s ease;
          background: #ffffff;
        }

        .agent-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.12);
        }

        .agent-card.selected {
          border-color: #4f46e5;
          background: #eef2ff;
          box-shadow: 0 18px 36px rgba(79,70,229,0.25);
        }

        .agent-card.disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        h4 {
          margin: 0;
          font-size: 15px;
          color: #0f172a;
        }

        .email {
          font-size: 12px;
          color: #64748b;
          margin: 4px 0 10px;
        }

        .busy {
          font-size: 11px;
          font-weight: 700;
          color: #dc2626;
        }

        .free {
          font-size: 11px;
          font-weight: 700;
          color: #16a34a;
        }

        footer {
          margin-top: 18px;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        button {
          padding: 10px 18px;
          border-radius: 10px;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .cancel {
          background: #e5e7eb;
        }

        .assign {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
        }

        .assign:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}

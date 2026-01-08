import { useState } from "react";

export default function CreateTicketModal({ onClose, onTicketCreated }) {
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const submit = async () => {
  if (!issue.trim()) {
    alert("Please describe your issue");
    return;
  }

  if (issue.length > 5000) {
    alert("Issue description too long (max 5000 characters)");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        issue,
        priority,
        userId: user.id
      })
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error(text || "Ticket creation failed");
    }

    const ticket = JSON.parse(text);
    onTicketCreated(ticket);
    onClose();

  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};





  return (
    <>
      <style>{`
        /* ===== Overlay ===== */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        /* ===== Modal Card ===== */
        .card {
          background: #ffffff;
          width: 440px;
          padding: 28px;
          border-radius: 20px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.35);
          animation: popIn 0.35s ease;
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .card h3 {
          margin: 0 0 18px;
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }

        /* ===== Inputs ===== */
        label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          margin-bottom: 6px;
        }

        textarea {
          width: 100%;
          min-height: 130px;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1px solid #c7d2fe;
          font-size: 14px;
          font-family: inherit;
          resize: none;
          outline: none;
          background: #f8fafc;
          transition: all 0.25s ease;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
        }

        textarea::placeholder {
          color: #94a3b8;
        }

        textarea:focus {
          background: white;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.15);
        }

        select {
          width: 100%;
          padding: 12px 14px;
          margin-top: 14px;
          border-radius: 12px;
          border: 1px solid #c7d2fe;
          font-size: 14px;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        select:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.15);
          background: white;
        }

        /* ===== Actions ===== */
        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 22px;
        }

        button {
          padding: 10px 18px;
          border-radius: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.10s ease;
        }

        .submit {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
        }

        .submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cancel {
          background: #ed0909ff;
          color: #ffffffff;
        }

        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.18);
        }
      `}</style>

      <div className="overlay">
        <div className="card">
          <h3>Create Ticket</h3>

          <label>Issue Description</label>
          <textarea
            placeholder="Clearly describe the issue you’re facing..."
            value={issue}
            onChange={e => setIssue(e.target.value)}
          />
            <div style={{ textAlign: "right", fontSize: "12px", color: "#64748b" }}>
              {issue.length}/5000
            </div>



          <label style={{ marginTop: "14px" }}>Priority</label>
          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <div className="actions">
            <button className="cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="submit" onClick={submit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

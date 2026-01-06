import { useNavigate } from "react-router-dom";

export default function TopBar({ title, subtitle }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .title h1 {
          margin: 0;
          font-size: 28px;
          color: #1e293b;
        }

        .title p {
          margin-top: 4px;
          color: #64748b;
        }

        .logout-btn {
          padding: 10px 18px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }
      `}</style>

      <div className="topbar">
        <div className="title">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </>
  );
}

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LandingPage() {
  const navigate = useNavigate();

  /* ===== ONLY animation logic ===== */
  useEffect(() => {
    const items = document.querySelectorAll(".fade-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${index * 120}ms`;
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: "Segoe UI", system-ui, sans-serif;
          background: radial-gradient(circle at top, #eef2ff, #f8fafc);
          color: #0f172a;
        }

        /* ===== PAGE LOAD FADE ===== */
        .page {
          animation: pageFade 0.8s ease forwards;
        }

        @keyframes pageFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ===== SCROLL FADE ===== */
        .fade-item {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .fade-item.show {
          opacity: 1;
          transform: translateY(0);
        }

        /* ================= HEADER ================= */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 22px 50px;
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 100;
        }

         .brand {
          font-size: 26px;
          font-weight: 900;
          letter-spacing: 0.5px;
          background: linear-gradient(135deg, #6366f1, #22c55e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          cursor: pointer;
          transition: filter 0.3s ease, transform 0.3s ease;
        }

        .brand:hover {
          filter: drop-shadow(0 0 12px rgba(99,102,241,0.6));
          transform: scale(1.04);
        }

        .nav button {
          margin-left: 14px;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .login {
          background: transparent;
          border: 2px solid #4f46e5;
          color: #4f46e5;
        }

        .signup {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
        }

        .nav button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(79,70,229,0.3);
        }

        /* ================= HERO ================= */
        .hero {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 60px;
          padding: 90px 80px;
          align-items: center;
        }

/* Hero text */
.hero h1 {
  font-size: 48px;
  line-height: 1.1;
  margin-bottom: 20px;
  font-weight: 700;
  color: #111827; /* fallback text color */
}

/* Gradient for spans */
.hero h1 span {
  background: linear-gradient(135deg, #6366f1, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Reveal animation */
.reveal-text span {
  display: inline-block;
  opacity: 0;
  transform: translateY(10px); /* start slightly lower */
  animation: fadeUp 0.8s ease forwards;
}

/* Stagger each word slightly */
.reveal-text span:nth-child(1) { animation-delay: 0.2s; }
.reveal-text span:nth-child(2) { animation-delay: 0.4s; }
.reveal-text span:nth-child(3) { animation-delay: 0.6s; }
.reveal-text span:nth-child(4) { animation-delay: 0.8s; }

/* Keyframes */
@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}



        .hero p {
          font-size: 18px;
          color: #475569;
          line-height: 1.7;
          max-width: 560px;
        }

        .cta {
          margin-top: 35px;
        }

        .cta button {
          padding: 14px 28px;
          border-radius: 14px;
          border: none;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          margin-right: 16px;
          transition: all 0.25s ease;
        }

        .start {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
        }

        .demo {
          background: white;
          border: 2px solid #4f46e5;
          color: #4f46e5;
        }

        .cta button:hover {
          transform: scale(1.05);
        }

        /* ================= MOCK (FLOATING UNCHANGED) ================= */
        .mock {
          background: white;
          border-radius: 22px;
          padding: 28px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.12);
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }

        .stat {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px dashed #e5e7eb;
          font-weight: 600;
        }

        .badge {
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .open { background: #dbeafe; color: #1d4ed8; }
        .pending { background: #fef3c7; color: #92400e; }
        .escalated { background: #fee2e2; color: #991b1b; }
        .resolved { background: #dcfce7; color: #166534; }

        /* ================= FEATURES ================= */
        .features {
          padding: 80px;
          background: linear-gradient(180deg, #f8fafc, #eef2ff);
        }

        .features h2 {
          text-align: center;
          font-size: 34px;
          margin-bottom: 50px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 30px;
        }

        .card {
          background: white;
          padding: 30px;
          border-radius: 18px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.08);
        }

        .card h4 {
          margin-bottom: 12px;
          color: #4f46e5;
        }

        .card p {
          color: #475569;
          line-height: 1.6;
        }

        /* ================= FOOTER ================= */
        .footer {
          text-align: center;
          padding: 25px;
          font-size: 14px;
          color: #64748b;
          background: #f1f5f9;
        }
      `}</style>

      <div className="page">
        {/* HEADER */}
        <div className="header">
          <div className="brand">
            SLA<span>spire</span>
          </div>
          <div className="nav">
            <button className="login" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="signup" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </div>
        </div>

        {/* HERO */}
        <section className="hero">
          <div>
            <h1 class="reveal-text">
              Where <span>Support</span> Meets <span>Speed</span>
            </h1>

            <p>
              SLAspire is a next-generation HelpDesk platform that tracks SLA
              deadlines, auto-escalates tickets, balances agent workload, and
              ensures no issue is ever ignored.
            </p>

            <div className="cta">
              <button className="start" onClick={() => navigate("/signup")}>
                Get Started Free
              </button>
              <button className="demo" onClick={() => navigate("/login")}>
                Live Demo
              </button>
            </div>
          </div>

          <div className="mock">
            <h3>Live Ticket Snapshot</h3>
            <br />
            <div className="stat">
              Open Tickets <span className="badge open">12</span>
            </div>
            <div className="stat">
              Pending <span className="badge pending">5</span>
            </div>
            <div className="stat">
              Escalated <span className="badge escalated">2</span>
            </div>
            <div className="stat">
              Resolved Today <span className="badge resolved">18</span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features">
          <h2 className="fade-item">Why Teams Choose SLAspire</h2>

          <div className="grid">
            <div className="card fade-item">
              <h4>⏱ SLA Intelligence</h4>
              <p>
                Real-time SLA tracking with automatic escalation and
                reassignment when time is reached.
              </p>
            </div>

            <div className="card fade-item">
              <h4>👥 Smart Agent Control</h4>
              <p>
                Prevent overload by assigning only one active ticket per agent.
              </p>
            </div>

            <div className="card fade-item">
              <h4>🚨 Escalation Engine</h4>
              <p>
                Expired tickets auto-remove from agents and return to admin.
              </p>
            </div>

            <div className="card fade-item">
              <h4>📊 Real-Time Dashboard</h4>
              <p>
                Track open, pending, escalated, and resolved tickets instantly.
              </p>
            </div>
          </div>
        </section>

        <div className="footer">
          © {new Date().getFullYear()} SLAspire — Smarter Support. Faster
          Resolution.
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  /* ================= SPLASH ================= */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  /* ================= LOGIN ================= */
  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Invalid credentials");
        setSubmitting(false);
        return;
      }

      if (data.role === "AGENT" && data.status === "PENDING") {
        setError("Admin approval pending");
        setSubmitting(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));

      if (data.role === "ADMIN") navigate("/admin/dashboard");
      else if (data.role === "AGENT") navigate("/agent/dashboard");
      else navigate("/user/dashboard");
    } catch {
      setError("Server not responding");
      setSubmitting(false);
    }
  };

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <>
        <div className="loader-page">
          <div className="logo">SLAspire</div>
          <div className="spinner"></div>
          <p>Loading secure login...</p>
        </div>

        <style>{`
          .loader-page {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: radial-gradient(circle at top, #eef2ff, #f8fafc);
            font-family: 'Segoe UI', sans-serif;
          }
          .logo {
            font-size: 32px;
            font-weight: 900;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #6366f1, #22c55e);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .spinner {
            width: 46px;
            height: 46px;
            border: 5px solid #e5e7eb;
            border-top: 5px solid #6366f1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          p { font-size: 14px; color: #475569; }
        `}</style>
      </>
    );
  }

  /* ================= PAGE ================= */
  return (
    <>
      {/* TOP BAR */}
      <div className="auth-header">
        <div className="brand" onClick={() => navigate("/")}>
          SLA<span>spire</span>
        </div>
      </div>

      {/* LOGIN */}
      <div className="auth-page">
        <form className="auth-card" onSubmit={submit}>
          <h2>Welcome Back</h2>

          {error && <div className="error">{error}</div>}

          <div className="group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="group password-box">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </button>

          <div className="footer">
            New user? <Link to="/signup">Create an account</Link>
          </div>
        </form>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        * { box-sizing: border-box; }

        .auth-header {
  position: absolute;
  top: 30px;
  left: 50px;
  z-index: 10;
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
        .auth-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(
    circle at top right,
    #e0e7ff,
    #f8fafc 60%
  );
  overflow: hidden;
}


        .auth-card {
          width: 380px;
          background: #fff;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
          text-align: center;
          font-family: 'Segoe UI', sans-serif;
        }

        h2 { margin-bottom: 24px; color: #1e293b; }

        .group { text-align: left; margin-bottom: 16px; }

        label { font-size: 13px; color: #475569; margin-bottom: 6px; display: block; }

        input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 14px;
        }

        .password-box { position: relative; }

        .password-box span {
          position: absolute;
          right: 12px;
          top: 38px;
          font-size: 13px;
          color: #6366f1;
          cursor: pointer;
        }

        button {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          font-size: 15px;
          cursor: pointer;
          margin-top: 10px;
          transition: all 0.3s ease;
        }

        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(99,102,241,0.35);
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .footer {
          margin-top: 20px;
          font-size: 14px;
          color: #64748b;
        }

        .footer a {
          color: #6366f1;
          text-decoration: none;
          font-weight: 500;
        }

        .error {
          background: #fee2e2;
          color: #991b1b;
          padding: 10px;
          border-radius: 8px;
          font-size: 13px;
          margin-bottom: 16px;
        }
      `}</style>
    </>
  );
}

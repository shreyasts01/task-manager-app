import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", formData);
      toast.success("Registration Successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = formData.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#EF4444", "#F59E0B", "#4A7EFF", "#3ECF8E"][strength];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --obsidian: #080A0E;
          --surface: #0E1117;
          --surface-2: #13161E;
          --surface-3: #1A1E2A;
          --gold: #C9A84C;
          --text-primary: #F0EBE0;
          --text-secondary: #8A8A9A;
          --text-muted: #555566;
          --font-display: 'Cormorant Garamond', serif;
          --font-body: 'DM Sans', sans-serif;
          --transition: 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .reg-root {
          min-height: 100vh;
          background: var(--obsidian);
          font-family: var(--font-body);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .reg-root::before {
          content: '';
          position: fixed;
          top: -20%; right: -15%;
          width: 620px; height: 620px;
          background: radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 65%);
          pointer-events: none;
        }
        .reg-root::after {
          content: '';
          position: fixed;
          bottom: -20%; left: -15%;
          width: 660px; height: 660px;
          background: radial-gradient(circle, rgba(62,207,142,0.05) 0%, transparent 65%);
          pointer-events: none;
        }

        .reg-grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
        }

        .reg-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: var(--surface);
          border: 1px solid rgba(201,168,76,0.14);
          border-radius: 28px;
          padding: 44px 40px 40px;
          animation: fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .reg-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          opacity: 0.7;
          border-radius: 1px;
        }

        /* Bottom-left corner accent (mirrored from Login's top-right) */
        .reg-card::after {
          content: '';
          position: absolute;
          bottom: -1px; left: -1px;
          width: 40px; height: 40px;
          border-bottom: 1px solid var(--gold);
          border-left: 1px solid var(--gold);
          border-radius: 0 0 0 28px;
          opacity: 0.5;
        }

        .reg-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 36px;
        }

        .reg-logo-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05));
          border: 1px solid rgba(201,168,76,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          box-shadow: 0 0 24px rgba(201,168,76,0.1);
        }

        .reg-eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 8px;
        }

        .reg-title {
          font-family: var(--font-display);
          font-size: 36px;
          font-weight: 700;
          letter-spacing: -0.5px;
          line-height: 1;
          color: var(--text-primary);
        }

        .reg-title span {
          background: linear-gradient(135deg, #F0D97A 0%, #C9A84C 50%, #A07830 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .reg-subtitle {
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 8px;
          font-weight: 300;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          margin: 28px 0 32px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 28px;
        }

        .field-wrap { display: flex; flex-direction: column; gap: 7px; }

        .field-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .field-input-wrap { position: relative; }

        .field-icon {
          position: absolute;
          left: 15px; top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
          transition: var(--transition);
        }

        .field-input-wrap:focus-within .field-icon { color: var(--gold); }

        .field-input {
          width: 100%;
          background: var(--surface-2);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 13px 44px;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 400;
          outline: none;
          transition: var(--transition);
          -webkit-appearance: none;
        }

        .field-input::placeholder { color: var(--text-muted); }

        .field-input:focus {
          border-color: rgba(201,168,76,0.45);
          background: var(--surface-3);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.07);
        }

        .toggle-pass {
          position: absolute;
          right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer;
          color: var(--text-muted);
          padding: 4px;
          display: flex; align-items: center;
          transition: var(--transition);
        }
        .toggle-pass:hover { color: var(--text-secondary); }

        /* Password strength */
        .strength-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }

        .strength-bars {
          display: flex;
          gap: 4px;
          flex: 1;
        }

        .strength-bar {
          flex: 1;
          height: 3px;
          border-radius: 2px;
          background: var(--surface-3);
          transition: background 0.3s ease;
        }

        .strength-text {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          min-width: 40px;
          text-align: right;
          transition: color 0.3s ease;
        }

        /* Terms note */
        .terms-note {
          font-size: 11.5px;
          color: var(--text-muted);
          text-align: center;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .terms-note a {
          color: var(--text-secondary);
          text-decoration: underline;
          text-decoration-color: rgba(138,138,154,0.4);
          transition: var(--transition);
        }
        .terms-note a:hover { color: var(--gold); }

        .submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #D4AC50 0%, #A07830 100%);
          color: #080A0E;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 4px 24px rgba(201,168,76,0.28);
          position: relative;
          overflow: hidden;
        }

        .submit-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: var(--transition);
        }

        .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(201,168,76,0.38); }
        .submit-btn:hover::before { opacity: 1; }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(8,10,14,0.3);
          border-top-color: #080A0E;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .reg-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 300;
        }

        .reg-footer a {
          color: var(--gold);
          font-weight: 500;
          text-decoration: none;
          transition: var(--transition);
        }
        .reg-footer a:hover { color: #F0D97A; }
      `}</style>

      <div className="reg-root">
        <div className="reg-grid-bg" />

        <div className="reg-card">
          <div className="reg-logo">
            <div className="reg-logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <p className="reg-eyebrow">Get Started</p>
            <h1 className="reg-title">Create <span>Account</span></h1>
            <p className="reg-subtitle">Join your workspace today</p>
          </div>

          <div className="divider" />

          <form onSubmit={handleSubmit}>
            <div className="field-group">

              {/* Name */}
              <div className="field-wrap">
                <label className="field-label">Full Name</label>
                <div className="field-input-wrap">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="field-input"
                    required
                  />
                  <span className="field-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="field-wrap">
                <label className="field-label">Email</label>
                <div className="field-input-wrap">
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="field-input"
                    required
                  />
                  <span className="field-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                </div>
              </div>

              {/* Password */}
              <div className="field-wrap">
                <label className="field-label">Password</label>
                <div className="field-input-wrap">
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="field-input"
                    required
                  />
                  <span className="field-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                    {showPass ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>

                {/* Strength meter */}
                {formData.password && (
                  <div className="strength-row">
                    <div className="strength-bars">
                      {[1,2,3,4].map((i) => (
                        <div
                          key={i}
                          className="strength-bar"
                          style={{ background: i <= strength ? strengthColor : undefined }}
                        />
                      ))}
                    </div>
                    <span className="strength-text" style={{ color: strengthColor }}>
                      {strengthLabel}
                    </span>
                  </div>
                )}
              </div>

            </div>

            <p className="terms-note">
              By creating an account you agree to our{" "}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <><span className="spinner" />Creating account…</> : "Create Account"}
            </button>
          </form>

          <p className="reg-footer">
            Already have an account?{" "}
            <Link to="/">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}

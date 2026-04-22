import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", data);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.message || err.message));
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none"
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "#fafbfc", minHeight: "100vh" }}>

      {/* NAVBAR */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 48px",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.15)"
      }}>
        {/* LOGO */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(233, 69, 96, 0.4)"
          }}>
            <span style={{ fontSize: "22px" }}>🔗</span>
          </div>
          <span style={{
            color: "#fff",
            fontSize: "24px",
            fontWeight: "700",
            letterSpacing: "-0.5px",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)"
          }}>
            LocalLink
          </span>
        </div>

        {/* NAV LINKS */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <a href="/" style={{
            background: "rgba(255,255,255,0.1)",
            color: "#e0e0e0",
            padding: "10px 18px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.15)",
            cursor: "pointer",
            fontWeight: "500",
            fontSize: "14px",
            textDecoration: "none",
            display: "inline-block",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 6px 20px rgba(255,255,255,0.2)"; }}
          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
          >
            Home
          </a>
          <a href="/login" style={{
            background: "linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            textDecoration: "none",
            display: "inline-block",
            boxShadow: "0 4px 15px rgba(233, 69, 96, 0.3)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 6px 20px rgba(233, 69, 96, 0.5)"; }}
          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 15px rgba(233, 69, 96, 0.3)"; }}
          >
            Login
          </a>
        </div>
      </div>

      {/* REGISTER CARD */}
      <div style={{
        maxWidth: "420px",
        margin: "60px auto",
        background: "#fff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
        border: "1px solid rgba(0,0,0,0.05)"
      }}>

        <h2 style={{ textAlign: "center", marginBottom: "8px", color: "#1a1a2e", fontSize: "28px" }}>Create Account</h2>
        <p style={{ textAlign: "center", marginBottom: "30px", color: "#666" }}>Join LocalLink to grow your business</p>

        <input
          placeholder="Name"
          value={data.name}
          onChange={e => setData({...data, name: e.target.value})}
          style={inputStyle}
        />

        <input
          placeholder="Email"
          value={data.email}
          onChange={e => setData({...data, email: e.target.value})}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={e => setData({...data, password: e.target.value})}
          style={inputStyle}
        />

        <button
          onClick={handleRegister}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)",
            color: "#fff",
            fontWeight: "600",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(233, 69, 96, 0.3)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 6px 20px rgba(233, 69, 96, 0.5)"; }}
          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 15px rgba(233, 69, 96, 0.3)"; }}
        >
          Create Account
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
          Already have an account? <Link to="/login" style={{ color: "#4f46e5" }}>Login</Link>
        </p>

      </div>
    </div>
  );
}
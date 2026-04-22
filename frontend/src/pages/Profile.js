import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const [businesses, setBusinesses] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    axios.get(`http://localhost:5000/api/business/owner/${parsedUser.email}`)
      .then(res => setBusinesses(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>;
  }

  const totalViews = businesses.reduce((sum, b) => sum + (b.views || 0), 0);
  const totalInteractions = businesses.reduce((sum, b) => sum + (b.interactions || 0), 0);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    border: "1px solid rgba(0,0,0,0.05)"
  };

  const statCardStyle = {
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    borderRadius: "12px",
    padding: "24px",
    color: "#fff",
    textAlign: "center",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)"
  };

  const buttonStyle = {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s"
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
          <span onClick={handleLogout} style={{
            background: "linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            display: "inline-block",
            boxShadow: "0 4px 15px rgba(233, 69, 96, 0.3)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 6px 20px rgba(233, 69, 96, 0.5)"; }}
          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 15px rgba(233, 69, 96, 0.3)"; }}
          >
            Logout
          </span>
        </div>
      </div>

      {/* PROFILE HEADER */}
      <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
        <div style={{ ...cardStyle, marginBottom: "24px", display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "32px",
            fontWeight: "700"
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: "0 0 8px 0" }}>{user.name}</h2>
            <p style={{ margin: 0, color: "#666" }}>{user.email}</p>
          </div>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
          <div style={statCardStyle}>
            <div style={{ fontSize: "36px", fontWeight: "700" }}>{businesses.length}</div>
            <div style={{ opacity: 0.9 }}>Businesses</div>
          </div>
          <div style={statCardStyle}>
            <div style={{ fontSize: "36px", fontWeight: "700" }}>{totalViews}</div>
            <div style={{ opacity: 0.9 }}>Total Reach</div>
          </div>
          <div style={statCardStyle}>
            <div style={{ fontSize: "36px", fontWeight: "700" }}>{totalInteractions}</div>
            <div style={{ opacity: 0.9 }}>Impressions</div>
          </div>
        </div>

        {/* MY BUSINESSES */}
        <h3 style={{ marginBottom: "16px" }}>My Businesses</h3>
        
        {businesses.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: "center", padding: "40px" }}>
            <p style={{ color: "#666", marginBottom: "16px" }}>You haven't listed any businesses yet.</p>
            <Link to="/" style={{
              background: "#4f46e5",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              display: "inline-block"
            }}>
              List Your Business
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {businesses.map(business => (
              <div key={business._id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4 style={{ margin: "0 0 8px 0" }}>{business.name}</h4>
                  <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>{business.category} • {business.address}</p>
                </div>
                <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "16px", textAlign: "center" }}>
                    <div>
                      <div style={{ fontSize: "20px", fontWeight: "700", color: "#4f46e5" }}>{business.views || 0}</div>
                      <div style={{ fontSize: "12px", color: "#666" }}>Reach</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "20px", fontWeight: "700", color: "#7c3aed" }}>{business.interactions || 0}</div>
                      <div style={{ fontSize: "12px", color: "#666" }}>Impressions</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBusiness(business)}
                    style={{ ...buttonStyle, background: "#4f46e5", color: "#fff" }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BUSINESS DETAILS MODAL */}
      {selectedBusiness && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "30px",
            maxWidth: "500px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0 }}>{selectedBusiness.name}</h2>
              <button
                onClick={() => setSelectedBusiness(null)}
                style={{ ...buttonStyle, background: "#f3f4f6", color: "#333" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              <div>
                <label style={{ fontWeight: "600", color: "#666", fontSize: "14px" }}>Category</label>
                <p style={{ margin: "4px 0 0 0" }}>{selectedBusiness.category}</p>
              </div>
              
              <div>
                <label style={{ fontWeight: "600", color: "#666", fontSize: "14px" }}>Description</label>
                <p style={{ margin: "4px 0 0 0" }}>{selectedBusiness.description || "No description provided"}</p>
              </div>

              <div>
                <label style={{ fontWeight: "600", color: "#666", fontSize: "14px" }}>Contact</label>
                <p style={{ margin: "4px 0 0 0" }}>{selectedBusiness.contact || "No contact provided"}</p>
              </div>

              <div>
                <label style={{ fontWeight: "600", color: "#666", fontSize: "14px" }}>Address</label>
                <p style={{ margin: "4px 0 0 0" }}>{selectedBusiness.address || "No address provided"}</p>
              </div>

              <div>
                <label style={{ fontWeight: "600", color: "#666", fontSize: "14px" }}>Owner</label>
                <p style={{ margin: "4px 0 0 0" }}>{selectedBusiness.owner}</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px", padding: "16px", background: "#f9fafb", borderRadius: "8px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#4f46e5" }}>{selectedBusiness.views || 0}</div>
                  <div style={{ fontSize: "14px", color: "#666" }}>Reach</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#7c3aed" }}>{selectedBusiness.interactions || 0}</div>
                  <div style={{ fontSize: "14px", color: "#666" }}>Impressions</div>
                </div>
              </div>

              <div>
                <label style={{ fontWeight: "600", color: "#666", fontSize: "14px" }}>Listed On</label>
                <p style={{ margin: "4px 0 0 0" }}>{new Date(selectedBusiness.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
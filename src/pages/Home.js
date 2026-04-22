import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showBrowse, setShowBrowse] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [createdBusiness, setCreatedBusiness] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    contact: "",
    address: "",
    owner: ""
  });
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  // ✅ INPUT STYLE (ADDED)
  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none"
  };

  // Nav Button Component
  const NavButton = ({ children, onClick, href, primary }) => {
    const style = primary 
      ? {
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
        }
      : {
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
        };

    if (href) {
      return (
        <a href={href} style={style}>
          {children}
        </a>
      );
    }
    return (
      <span 
        onClick={onClick} 
        style={style}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = primary 
            ? "0 6px 20px rgba(233, 69, 96, 0.5)"
            : "0 6px 20px rgba(255,255,255,0.2)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = primary 
            ? "0 4px 15px rgba(233, 69, 96, 0.3)"
            : "none";
        }}
      >
        {children}
      </span>
    );
  };

  // Helper function to get category-specific image
  const getCategoryImage = (category) => {
    switch (category) {
      case "Restaurant":
        return "https://as2.ftcdn.net/v2/jpg/05/77/47/37/1000_F_577473737_1DrgxNrW3Ff0MyjDA9lzhnAEP6qrg6BX.jpg";
      case "Retail":
        return "https://media.istockphoto.com/photos/the-fruits-on-sell-on-market-at-puerto-limon-costa-rica-picture-id1201000553?k=20&m=1201000553&s=612x612&w=0&h=rJdAcbqUJt21Hz3aURrBKZwlSmvBGIHaq9JrDyUl3rE=";
      case "Service":
        return "https://ec.whatjobs.com/news/wj-material/uploads/2026/04/Amazon-Reaches-U.S.-Postal-Service-Deal-Covering-About-1-Billion-Packages-a-Year.webp";
      case "Beauty & Wellness":
        return "https://img.freepik.com/premium-vector/beauty-health-illustration-with-natural-cosmetics-eco-products-skin-treatment-face_2175-13461.jpg?w=2000";
      case "Fashion & Apparel":
        return "https://thumbs.dreamstime.com/b/large-display-clothing-clothing-store-postminimalism-high-detailed-store-fashion-clothes-stores-large-display-332032440.jpg";
      case "Photography":
        return "https://images.pexels.com/photos/1319796/pexels-photo-1319796.jpeg?auto=compress&cs=tinysrgb&w=1200";
      case "Home Services":
        return "https://images.pexels.com/photos/271805/pexels-photo-271805.jpeg?auto=compress&cs=tinysrgb&w=1200";
      case "Flowers & Gifts":
        return "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=1200";
      default:
        return "https://nichehacks.com/wp-content/uploads/2024/02/300-Creative-Cafe-Names-and-Ideas-for-Your-Business.png";
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/business")
      .then((res) => setBusinesses(res.data))
      .catch((err) => console.log(err));

    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      setUserLoggedIn(true);
    }
  }, []);

  const handleCreateBusiness = async () => {
    try {
      const userData = localStorage.getItem("user");
      const ownerEmail = userData ? JSON.parse(userData).email : formData.owner;
      
      const res = await axios.post(
        "http://localhost:5000/api/business",
        { ...formData, owner: ownerEmail }
      );

      // ✅ Add new business to UI instantly
      setBusinesses([res.data, ...businesses]);

      // ✅ Show profile page
      setCreatedBusiness(res.data);
      setShowForm(false);
      setShowProfile(true);

      // ✅ Clear form
      setFormData({
        name: "",
        category: "",
        description: "",
        contact: "",
        address: "",
        owner: ""
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteBusiness = async (businessId) => {
    if (window.confirm("Are you sure you want to delete this business listing?")) {
      try {
        await axios.delete(`http://localhost:5000/api/business/${businessId}`);
        
        // Remove the business from the state
        setBusinesses(businesses.filter(b => b._id !== businessId));
        
        // Close the details view
        setShowDetails(false);
        setSelectedBusiness(null);
        
        alert("Business listing deleted successfully!");
      } catch (err) {
        console.log(err);
        alert("Failed to delete business listing. Please try again.");
      }
    }
  };

  const filteredBusinesses = businesses.filter((business) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      [
        business.name,
        business.category,
        business.description,
        business.contact,
        business.address,
        business.owner
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query));

    const matchesCategory =
      !categoryFilter || business.category === categoryFilter;

    return matchesQuery && matchesCategory;
  });

  const categoryCards = [
    { name: "Food & Beverage", category: "Restaurant", icon: "🍽️", color: "#ff6b35" },
    { name: "Beauty & Wellness", category: "Beauty & Wellness", icon: "💄", color: "#f7931e" },
    { name: "Fashion & Apparel", category: "Fashion & Apparel", icon: "👗", color: "#4ecdc4" },
    { name: "Flowers & Gifts", category: "Flowers & Gifts", icon: "🌸", color: "#ff6b9d" },
    { name: "Photography", category: "Photography", icon: "📷", color: "#6c5ce7" },
    { name: "Home Services", category: "Home Services", icon: "🏠", color: "#eb6f4b" }
  ];

  const categoryCounts = categoryCards.reduce((acc, card) => {
    acc[card.name] = businesses.filter((business) => business.category === card.category).length;
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "#fafbfc" }}>

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
          <NavButton onClick={() => setShowBrowse(true)}>Browse Businesses</NavButton>
          <NavButton href="/login">Login</NavButton>
          <NavButton href="/register" primary>Sign Up</NavButton>
          <NavButton href="/profile">Profile</NavButton>

          {/* ✅ UPDATED BUTTON */}
          <button
            onClick={() => userLoggedIn ? setShowForm(true) : window.location.href = "/login"}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            style={{
              background: "#4f46e5",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
          >
            + List Your Business
          </button>
        </div>
      </div>

      {/* ========================= */}
      {/* ✅ FORM OVERLAY (ADDED) */}
      {/* ========================= */}
      {showForm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#f9fafb",
          zIndex: 2000,
          overflowY: "auto"
        }}>

          {/* TOP BAR */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px 60px",
            background: "#fff",
            borderBottom: "1px solid #eee"
          }}>
            <span
              onClick={() => setShowForm(false)}
              style={{ cursor: "pointer" }}
            >
              ← Back to Home
            </span>

            <button
              onClick={() => setShowForm(false)}
              style={{
                border: "1px solid #ccc",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                background: "#fff"
              }}
            >
              Close
            </button>
          </div>

          {/* FORM CARD */}
          <div style={{
            maxWidth: "700px",
            margin: "40px auto",
            background: "#fff",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
          }}>

            <h2>List Your Business</h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Fill in the details below to create your business profile and start connecting with customers.
            </p>

            <input
              placeholder="Business Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={inputStyle}
            />

            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={inputStyle}
            >
              <option value="">Select a category *</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Retail">Retail</option>
              <option value="Service">Service</option>
              <option value="Beauty & Wellness">Beauty & Wellness</option>
              <option value="Fashion & Apparel">Fashion & Apparel</option>
              <option value="Photography">Photography</option>
              <option value="Home Services">Home Services</option>
              <option value="Flowers & Gifts">Flowers & Gifts</option>
            </select>

            <textarea
              placeholder="Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ ...inputStyle, height: "90px" }}
            />

            <input
              placeholder="Phone number or email *"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Owner/Manager Name *"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              style={inputStyle}
            />

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleCreateBusiness}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(to right, #4f46e5, #7c3aed)",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Create Business Listing
              </button>

              <button
                onClick={() => setShowForm(false)}
                style={{
                  padding: "12px 20px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  background: "#fff",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>

            {/* NOTE */}
            <div style={{
              marginTop: "20px",
              background: "#eef2ff",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "14px"
            }}>
              <b>Note:</b> Your business listing will be visible to everyone on the platform.
            </div>

          </div>
        </div>
      )}

      {/* ========================= */}
      {/* DETAILS OVERLAY (ADDED) */}
      {/* ========================= */}
      {showDetails && selectedBusiness && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#f3f6fb",
          zIndex: 2000,
          overflowY: "auto"
        }}>

          <div style={{
            maxWidth: "980px",
            margin: "0 auto",
            padding: "24px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <button
              onClick={() => setShowDetails(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "transparent",
                border: "none",
                color: "#111827",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: 600
              }}
            >
              ← Back to Businesses
            </button>
            <button
              onClick={() => setShowDetails(false)}
              style={{
                padding: "10px 16px",
                borderRadius: "999px",
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Close
            </button>
          </div>

          <div style={{
            maxWidth: "980px",
            margin: "0 auto 40px",
            padding: "24px",
            background: "#fff",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "24px", flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ flex: "1 1 60%", minWidth: "280px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
                  <span style={{
                    padding: "6px 12px",
                    borderRadius: "999px",
                    background: "#eef2ff",
                    color: "#4338ca",
                    fontWeight: 700,
                    fontSize: "13px",
                    textTransform: "uppercase"
                  }}>
                    {selectedBusiness.category || "Business"}
                  </span>
                </div>
                <h1 style={{
                  fontSize: "3rem",
                  lineHeight: 1.05,
                  margin: 0,
                  letterSpacing: "-0.04em"
                }}>
                  {selectedBusiness.name}
                </h1>
                <p style={{ color: "#6b7280", marginTop: "12px", fontSize: "16px" }}>
                  by {selectedBusiness.owner || "Unknown"}
                </p>
                <p style={{ color: "#374151", marginTop: "22px", fontSize: "16px", lineHeight: 1.75 }}>
                  {selectedBusiness.description || "No description available."}
                </p>
              </div>

              <button
                onClick={() => handleDeleteBusiness(selectedBusiness._id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "48px",
                  height: "48px",
                  borderRadius: "16px",
                  border: "1px solid #f87171",
                  background: "#fff",
                  color: "#ef4444",
                  cursor: "pointer"
                }}
                title="Delete listing"
              >
                🗑
              </button>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "18px",
              marginTop: "32px"
            }}>
              <div style={{ padding: "22px", borderRadius: "20px", background: "#f8fafc" }}>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>Address</p>
                <p style={{ margin: "8px 0 0", color: "#111827", fontSize: "16px" }}>
                  {selectedBusiness.address || "Not provided"}
                </p>
              </div>
              <div style={{ padding: "22px", borderRadius: "20px", background: "#f8fafc" }}>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>Contact</p>
                <p style={{ margin: "8px 0 0", color: "#111827", fontSize: "16px" }}>
                  {selectedBusiness.contact || "Not provided"}
                </p>
              </div>
              <div style={{ padding: "22px", borderRadius: "20px", background: "#f8fafc" }}>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>Owner</p>
                <p style={{ margin: "8px 0 0", color: "#111827", fontSize: "16px" }}>
                  {selectedBusiness.owner || "Unknown"}
                </p>
              </div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "18px",
              marginTop: "32px"
            }}>
              <div style={{ background: "#eff6ff", padding: "24px", borderRadius: "20px" }}>
                <div style={{ fontSize: "13px", color: "#4338ca", fontWeight: 700, marginBottom: "8px" }}>Views</div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#111827" }}>{selectedBusiness.views || 0}</div>
              </div>
              <div style={{ background: "#f5f3ff", padding: "24px", borderRadius: "20px" }}>
                <div style={{ fontSize: "13px", color: "#7c3aed", fontWeight: 700, marginBottom: "8px" }}>Interactions</div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#111827" }}>{selectedBusiness.interactions || 0}</div>
              </div>
              <div style={{ background: "#ecfdf5", padding: "24px", borderRadius: "20px" }}>
                <div style={{ fontSize: "13px", color: "#059669", fontWeight: 700, marginBottom: "8px" }}>Listed</div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#111827" }}>
                  {selectedBusiness.createdAt ? new Date(selectedBusiness.createdAt).toLocaleDateString() : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBrowse ? (
        <div style={{ padding: "40px 60px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "30px"
          }}>
            <div>
              <h1 style={{ fontSize: "36px", fontWeight: "800", margin: 0 }}>
                Browse Businesses
              </h1>
              <p style={{ color: "#555", marginTop: "10px" }}>
                Search local businesses and filter by category.
              </p>
            </div>

            <button
              onClick={() => setShowBrowse(false)}
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                background: "#fff",
                color: "#111",
                cursor: "pointer"
              }}
            >
              Back to Home
            </button>
          </div>

          <div style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: "30px"
          }}>
            <input
              placeholder="Search businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                ...inputStyle,
                flex: 1,
                minWidth: "240px"
              }}
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                ...inputStyle,
                minWidth: "220px"
              }}
            >
              <option value="">All Categories</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Retail">Retail</option>
              <option value="Service">Service</option>
              <option value="Beauty & Wellness">Beauty & Wellness</option>
              <option value="Fashion & Apparel">Fashion & Apparel</option>
              <option value="Photography">Photography</option>
              <option value="Home Services">Home Services</option>
              <option value="Flowers & Gifts">Flowers & Gifts</option>
            </select>

            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("");
              }}
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                border: "none",
                background: "#4f46e5",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              Clear
            </button>
          </div>

          {filteredBusinesses.length === 0 ? (
            <div style={{
              background: "#fff",
              padding: "60px",
              borderRadius: "24px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
            }}>
              <h2 style={{ marginBottom: "10px" }}>No businesses found</h2>
              <p style={{ color: "#666", marginBottom: "25px" }}>
                Try changing your search terms or category.
              </p>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(to right, #4f46e5, #7c3aed)",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                List Your Business
              </button>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "25px"
            }}>
              {filteredBusinesses.map((b, index) => (
                <div
                  key={b._id}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: "#fff",
                    borderRadius: "14px",
                    overflow: "hidden",
                    border: hovered === index ? "2px solid #4f46e5" : "1px solid #eee",
                    boxShadow: hovered === index
                      ? "0 15px 35px rgba(79,70,229,0.25)"
                      : "0 8px 20px rgba(0,0,0,0.08)",
                    transform: hovered === index ? "translateY(-8px)" : "none",
                    transition: "all 0.3s ease"
                  }}
                >
                  <img
                    src={b.image || getCategoryImage(b.category)}
                    alt={b.name}
                    style={{
                      width: "100%",
                      height: "240px",
                      objectFit: "cover"
                    }}
                  />

                  <div style={{ padding: "18px" }}>
                    <h3>{b.name}</h3>
                    <p style={{ color: "#4f46e5", fontWeight: "600", margin: "8px 0" }}>
                      {b.category}
                    </p>
                    <p style={{ color: "#666", minHeight: "80px" }}>{b.description}</p>

                    <div style={{
                      display: "flex",
                      gap: "12px",
                      marginBottom: "12px",
                      fontSize: "12px",
                      color: "#6b7280"
                    }}>
                      <span>👁️ {b.views || 0}</span>
                      <span>💬 {b.interactions || 0}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedBusiness(b);
                        setShowDetails(true);
                      }}
                      style={{
                        marginTop: "16px",
                        width: "100%",
                        padding: "12px",
                        background: "#4f46e5",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer"
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* HERO */}
          <div style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "linear-gradient(to right, #eef2ff, #f9fafb)"
          }}>
            <h1 style={{
              fontSize: "42px",
              fontWeight: "800"
            }}>
              Connect Your <span style={{ color: "#4f46e5" }}>Local Business</span><br />
              With Your Community
            </h1>

        <p style={{
          marginTop: "15px",
          fontSize: "18px",
          color: "#555"
        }}>
          Local Link helps small businesses grow their reach and engage with customers.
        </p>

        <div style={{ marginTop: "25px" }}>
          {/* ✅ UPDATED BUTTON */}
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: "#4f46e5",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              marginRight: "10px",
              cursor: "pointer"
            }}
          >
            Get Started →
          </button>

          <button
            onClick={() => setShowBrowse(true)}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer"
            }}
          >
            🔍 Explore Businesses
          </button>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ textAlign: "center", marginTop: "60px", marginBottom: "40px" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "12px" }}>
          Why Choose Local Link?
        </h2>
        <p style={{ color: "#6b7280", fontSize: "16px" }}>
          Everything you need to grow your local business
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "28px",
        padding: "0px 60px",
        marginBottom: "60px"
      }}>
        {[
          { 
            title: "Easy Business Listing", 
            desc: "Create a professional profile in minutes and start reaching customers today.", 
            icon: "✨",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            bgLight: "#f5f3ff"
          },
          { 
            title: "Customer Engagement", 
            desc: "Connect directly with your community and build lasting relationships.", 
            icon: "🤝",
            gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            bgLight: "#ffe5ec"
          },
          { 
            title: "Track Your Reach", 
            desc: "Monitor views, interactions, and grow your business with real insights.", 
            icon: "📊",
            gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            bgLight: "#e0f7ff"
          }
        ].map((item, i) => (
          <div 
            key={i} 
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
            }}
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "40px 28px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              border: "1px solid #f0f0f0",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Decorative gradient background */}
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "120px",
              height: "120px",
              background: item.bgLight,
              borderRadius: "50%",
              opacity: 0.5,
              zIndex: 0
            }}></div>

            {/* Icon */}
            <div style={{
              fontSize: "48px",
              marginBottom: "18px",
              zIndex: 1,
              position: "relative"
            }}>
              {item.icon}
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: "20px",
              fontWeight: "700",
              marginBottom: "12px",
              color: "#111827",
              zIndex: 1,
              position: "relative"
            }}>
              {item.title}
            </h3>

            {/* Description */}
            <p style={{
              color: "#6b7280",
              fontSize: "15px",
              lineHeight: "1.6",
              margin: 0,
              zIndex: 1,
              position: "relative"
            }}>
              {item.desc}
            </p>

            {/* Accent line */}
            <div style={{
              marginTop: "18px",
              height: "4px",
              background: item.gradient,
              borderRadius: "2px",
              width: "40px",
              zIndex: 1,
              position: "relative"
            }}></div>
          </div>
        ))}
      </div>

      {/* BROWSE BY CATEGORY */}
      <div style={{ textAlign: "center", marginTop: "80px", marginBottom: "60px" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "12px" }}>
          Browse by Category
        </h2>
        <p style={{ color: "#6b7280", fontSize: "16px" }}>
          Explore local vendors across various categories and find exactly what you need
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "24px",
        padding: "0px 60px",
        marginBottom: "80px"
      }}>
        {categoryCards.map((category, i) => (
          <div
            key={i}
            onClick={() => {
              setCategoryFilter(category.category);
              setShowBrowse(true);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
            }}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "32px 24px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Background accent */}
            <div style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "150px",
              height: "150px",
              background: category.color,
              borderRadius: "50%",
              opacity: 0.08,
              zIndex: 0
            }}></div>

            {/* Icon */}
            <div style={{
              fontSize: "48px",
              marginBottom: "16px",
              zIndex: 1,
              position: "relative"
            }}>
              {category.icon}
            </div>

            {/* Category Name */}
            <h3 style={{
              fontSize: "18px",
              fontWeight: "700",
              marginBottom: "8px",
              color: "#111827",
              zIndex: 1,
              position: "relative"
            }}>
              {category.name}
            </h3>

            {/* Business Count */}
            <p style={{
              color: "#6b7280",
              fontSize: "14px",
              margin: 0,
              zIndex: 1,
              position: "relative"
            }}>
              {categoryCounts[category.name] || 0} business
            </p>
          </div>
        ))}
      </div>

      {/* BUSINESS CARDS */}
      <div style={{
        padding: "40px 60px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", margin: 0 }}>
            Featured Businesses
          </h2>
          {businesses.length > 3 && (
            <button
              onClick={() => setShowBrowse(true)}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                background: "#4f46e5",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              View All Businesses
            </button>
          )}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "25px"
        }}>
          {businesses.slice(0, 3).map((b, index) => (
            <div
              key={b._id}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: "#fff",
                borderRadius: "14px",
                overflow: "hidden",
                border: hovered === index ? "2px solid #4f46e5" : "1px solid #eee",
                boxShadow: hovered === index
                  ? "0 15px 35px rgba(79,70,229,0.25)"
                  : "0 8px 20px rgba(0,0,0,0.08)",
                transform: hovered === index ? "translateY(-8px)" : "none",
                transition: "all 0.3s ease"
              }}
            >
              <img
                src={b.image || getCategoryImage(b.category)}
                alt={b.name}
                style={{
                  width: "100%",
                  height: "280px",
                  objectFit: "cover"
                }}
              />

              <div style={{ padding: "15px" }}>
                <h3>{b.name}</h3>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "10px" }}>{b.description}</p>

                <div style={{
                  display: "flex",
                  gap: "15px",
                  marginBottom: "12px",
                  fontSize: "13px",
                  color: "#6b7280"
                }}>
                  <span>👁️ {b.views || 0} views</span>
                  <span>💬 {b.interactions || 0} interactions</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedBusiness(b);
                    setShowDetails(true);
                  }}
                  style={{
                    marginTop: "12px",
                    width: "100%",
                    padding: "10px",
                    background: "#4f46e5",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px"
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        margin: "60px",
        padding: "40px",
        borderRadius: "16px",
        background: "linear-gradient(to right, #4f46e5, #7c3aed)",
        color: "#fff",
        textAlign: "center"
      }}>
        <h2>Ready to Grow Your Business?</h2>

        <p style={{ marginTop: "10px" }}>
          Join hundreds of local businesses using Local Link.
        </p>

        <button
          onClick={() => setShowForm(true)}
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            background: "#fff",
            color: "#4f46e5",
            borderRadius: "8px",
            border: "none",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          List Your Business Now →
        </button>
      </div>
        </>
      )}

    </div>
  );
}
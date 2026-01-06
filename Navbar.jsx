import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import bookishLogo from "../assets/navlogo.jpeg"; // ✅ logo import

export default function Navbar({ setIsAuth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [search, setSearch] = useState("");

  const showSearchBar = !isAdmin && location.pathname === "/home";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userId");
    setIsAuth(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?query=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  return (
    <div style={styles.navbar}>
      {/* 🔰 Logo Section */}
      <div style={styles.logoWrapper}>
        <div style={styles.logoBox}>
          <img
            src={bookishLogo}
            alt="Bookish Logo"
            style={styles.logoImage}
          />
        </div>
        <h2 style={styles.logoText}>Bookish</h2>
      </div>

      {/* 🔍 Search Bar */}
      {showSearchBar && (
        <div style={styles.searchWrapper}>
          <form onSubmit={handleSearch} style={{ width: "100%" }}>
            <input
              type="text"
              placeholder="Search books, authors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </form>
        </div>
      )}

      {/* 🔗 Links */}
      <div style={styles.links}>
        {!isAdmin && (
          <>
            <Link to="/home" style={styles.link}>Home</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <Link to="/rentals" style={styles.link}>My Rentals</Link>
          </>
        )}
        {isAdmin && (
          <Link to="/admin" style={styles.link}>Admin Dashboard</Link>
        )}
        <button onClick={handleLogout} style={styles.logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "95px",
  padding: "0 40px",
  background: "linear-gradient(90deg, #3b2f2f, #6b4f2a)",
  color: "#f5f5f5",
  borderRadius: "22px",
  margin: "14px 18px",
  boxShadow: "0 14px 30px rgba(0,0,0,0.4)", // ⬆ deeper shadow
},


  logoWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    minWidth: "220px",
  },

  /* 🟫 Square logo container (professional look) */
  logoBox: {
  width: "68px",
  height: "68px",
  borderRadius: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  /* ✨ Blending effect instead of solid box */
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(6px)",

  /* Soft premium shadow */
  boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
},

logoImage: {
  width: "54px",
  height: "54px",
  objectFit: "contain",

  /* helps color mismatch a bit */
  filter: "brightness(1.1)",
},


logoText: {
  margin: 0,
  fontSize: "26px",
  fontWeight: "700",
  letterSpacing: "1.2px",
  color: "#f8f5f2",
},

  searchWrapper: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },

  searchInput: {
    width: "60%",
    maxWidth: "420px",
    padding: "12px 20px",
    borderRadius: "30px",
    border: "none",
    outline: "none",
    fontSize: "15px",
    backgroundColor: "#f1f5f9",
  },

  links: {
    display: "flex",
    gap: "26px",
    alignItems: "center",
    minWidth: "320px",
    justifyContent: "flex-end",
  },

  link: {
    color: "#f5f5f5",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
  },

  logout: {
    backgroundColor: "#b18d79ff",
    border: "none",
    padding: "10px 18px",
    color: "white",
    borderRadius: "22px",
    cursor: "pointer",
    fontSize: "14px",
  },
};
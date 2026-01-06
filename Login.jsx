import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../apis/api";
import logo from "../assets/logo.jpeg";

export default function Login({ setIsAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      const isAdmin = res.data.user.isAdmin || false;
      localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
      setIsAuth(true);
      navigate(isAdmin ? "/admin" : "/home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.fullPage}>
      <div style={styles.container}>
        <div style={{ textAlign: "center" }}>
  <div style={styles.logoWrapper}>
  <img
    src={logo}
    alt="Bookish Logo"
    style={styles.logo}
  />
</div>

</div>


        <h2 style={styles.title}>Welcome to Bookish</h2>

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ textAlign: "center", marginTop: "10px", fontSize: '14px', color: '#5d4037' }}>
          Don't have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  fullPage: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#f5f0e1',
    backgroundImage: "url(/background2.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  container: {
    width: "100%",
    maxWidth: "350px",
    padding: "40px 30px",
    borderRadius: "15px",
    backgroundColor: "rgba(255,255,255,0.95)",
    boxShadow: "0 10px 30px rgba(93, 64, 55, 0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  title: { textAlign: "center", color: '#5d4037', marginBottom: '5px' },
  input: {
    padding: "12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #d7ccc8",
    outline: 'none'
  },


  logoWrapper: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",   // ✅ VERY IMPORTANT
  width: "200px",
  margin: "0 auto"
},

logo: {
  width: "200px",
  height: "auto",
  display: "block",
  transform: "scale(1.35)", // ✅ crops left & right padding
},


  button: {
    padding: "14px",
    background: "#795548",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: '16px'
  },
  link: { color: "#8d6e63", cursor: "pointer", fontWeight: "bold" },
  error: { color: "#d32f2f", fontSize: "14px", textAlign: 'center' },
};
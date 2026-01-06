import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../apis/api";

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);
  const navigate = useNavigate();

  const fetchRentals = async () => {
    try {
      const res = await api.get("/rentals/my", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setRentals(res.data || []);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const cancelRental = async (id) => {
    try {
      setCancelingId(id);
      await api.delete(`/rentals/cancel/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      fetchRentals(); 
    } catch (err) {
      alert("Failed to cancel rental");
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px", color: "#3e2723" }}>Loading...</div>;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h2 style={styles.title}>Your Rentals</h2>
        <Link to="/home">
          <button style={styles.buttonMain}>Back to Home</button>
        </Link>
      </div>

      {rentals.length === 0 ? (
        <p style={styles.emptyMsg}>No active rentals found.</p>
      ) : (
        <div style={styles.grid}>
          {rentals.map((r) => (
            <div key={r._id} style={styles.card}>
              <img
                src={r.bookId?.image}
                alt={r.bookId?.title}
                style={styles.img}
              />
              <div style={styles.content}>
                <h3 style={styles.bookTitle}>{r.bookId?.title}</h3>
                <p style={styles.text}><strong>Author:</strong> {r.bookId?.author}</p>
                <p style={styles.text}><strong>Price:</strong> ₹{r.bookId?.price}</p>
                <p style={styles.date}>Rented on: {new Date(r.createdAt).toLocaleDateString()}</p>
                
                <button
                  onClick={() => cancelRental(r._id)}
                  disabled={cancelingId === r._id}
                  style={{
                    ...styles.buttonMain,
                    width: "fit-content",
                    opacity: cancelingId === r._id ? 0.7 : 1,
                    marginTop: "auto"
                  }}
                >
                  {cancelingId === r._id ? "Processing..." : "Return Book"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  pageContainer: {
    width: "100%",            // ✅ FULL WIDTH
    padding: "40px",
    backgroundColor: "#fdfaf5",
    minHeight: "100vh",
    boxSizing: "border-box",
    fontFamily:
      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    borderBottom: "2px solid #d7ccc8",
    paddingBottom: "15px"
  },
  title: {
    color: "#3e2723",
    fontSize: "28px",
    fontWeight: "bold",
    margin: 0
  },
  // Unified button style for both "Back to Home" and "Return Book"
  buttonMain: {
    background: "#6d4c41", 
    color: "white",
    border: "none",
    padding: "10px 22px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "background 0.2s"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))",
    gap: "25px"
  },
  card: {
    display: "flex",
    background: "#f2ece4", // Your requested warm greyish-brown shade
    borderRadius: "12px",
    border: "1px solid #d7ccc8",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
  },
  img: {
    width: "140px",
    height: "200px",
    objectFit: "cover"
  },
  content: {
    padding: "20px",
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  bookTitle: {
    margin: "0 0 10px 0",
    color: "#2d1b15",
    fontSize: "22px"
  },
  text: {
    margin: "4px 0",
    color: "#4e342e",
    fontSize: "15px"
  },
  date: {
    fontSize: "13px",
    color: "#8d6e63",
    marginTop: "5px",
    marginBottom: "20px"
  },
  emptyMsg: {
    textAlign: "center",
    color: "#8d6e63",
    marginTop: "50px",
    fontSize: "18px"
  }
};
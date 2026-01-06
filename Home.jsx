import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../apis/api";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/books/latest");
        setBooks(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching books", err);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div style={styles.page}>
      {/* 🔹 Section Title */}
      <h2 style={styles.heading}>
         New Arrivals
      </h2>

      {loading && <p style={styles.status}>Loading books...</p>}
      {!loading && books.length === 0 && (
        <p style={styles.status}>No books available</p>
      )}

      {/* 🔹 Book Grid */}
      <div style={styles.grid}>
        {books.map((book) => (
          <div
            key={book._id}
            style={styles.card}
            onClick={() => navigate(`/book/${book._id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.07)";
              e.currentTarget.style.boxShadow =
                "0 14px 35px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 6px 14px rgba(0,0,0,0.18)";
            }}
          >
            <img
              src={book.image}
              alt={book.title}
              style={styles.image}
            />

            <h3 style={styles.title}>{book.title}</h3>

            <p style={styles.text}><b>Author:</b> {book.author}</p>
            <p style={styles.text}><b>Category:</b> {book.category}</p>
            <p style={styles.price}>₹ {book.price}</p>
            <p style={styles.meta}>Year: {book.year}</p>
            <p style={styles.meta}>ISBN: {book.isbn}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: "40px 60px",
    backgroundColor: "#f4efe9",   // 🔑 BOOKISH beige tone
    minHeight: "100vh",
  },

  heading: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "40px",
    letterSpacing: "1px",
    color: "#3b2f2f",
  },

  status: {
    textAlign: "center",
    fontSize: "16px",
    color: "#555",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "28px",
    maxWidth: "1300px",
    margin: "0 auto",
  },

  card: {
    backgroundColor: "#fffaf3",
    borderRadius: "12px",
    padding: "14px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease", // smoother hover
  },

  image: {
    width: "100%",
    height: "300px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "12px",
  },

  title: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "6px",
    color: "#2f1f1f",
  },

  text: {
    fontSize: "14px",
    margin: "2px 0",
    color: "#4b3a2f",
  },

  price: {
    fontSize: "16px",
    fontWeight: "700",
    marginTop: "6px",
    color: "#7a4a2e",
  },

  meta: {
    fontSize: "12px",
    color: "#6b6b6b",
  },
};

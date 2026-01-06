import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../apis/api";

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("query") || "";

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!query) return setBooks([]);
      setLoading(true);
      try {
        const res = await api.get(`/books/search?query=${encodeURIComponent(query)}`);
        setBooks(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching search results", err);
        setBooks([]);
        setLoading(false);
      }
    };
    fetchBooks();
  }, [query]);

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>
        Search Results for "{query}"
      </h2>

      {loading && <p style={styles.status}>Searching books...</p>}
      {!loading && books.length === 0 && <p style={styles.status}>No books found</p>}

      <div style={styles.grid}>
        {books.map((book) => (
          <div
            key={book._id}
            style={styles.card}
            onClick={() => navigate(`/book/${book._id}`)}
          >
            <img src={book.image} alt={book.title} style={styles.image} />
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

/* Use the same styles as Home.jsx */
const styles = {
  page: { padding: "40px 60px", backgroundColor: "#f4efe9", minHeight: "100vh" },
  heading: { textAlign: "center", fontSize: "28px", fontWeight: "700", marginBottom: "40px", letterSpacing: "1px", color: "#3b2f2f" },
  status: { textAlign: "center", fontSize: "16px", color: "#555" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "28px", maxWidth: "1300px", margin: "0 auto" },
  card: { backgroundColor: "#fffaf3", borderRadius: "12px", padding: "14px", textAlign: "center", cursor: "pointer", boxShadow: "0 6px 14px rgba(0,0,0,0.18)", transition: "transform 0.2s ease" },
  image: { width: "100%", height: "300px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" },
  title: { fontSize: "18px", fontWeight: "700", marginBottom: "6px", color: "#2f1f1f" },
  text: { fontSize: "14px", margin: "2px 0", color: "#4b3a2f" },
  price: { fontSize: "16px", fontWeight: "700", marginTop: "6px", color: "#7a4a2e" },
  meta: { fontSize: "12px", color: "#6b6b6b" },
};
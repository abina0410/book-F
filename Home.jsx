import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../apis/api";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All"); 
  const [showCategories, setShowCategories] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "All",
    "Fiction",
    "Classic",
    "Self-help",
    "Fantasy",
    "Memoir",
    "Science Fiction",
    "Comedy Adventure",
    "Historical fiction",
    "Speculative fiction",
    "Fantasy Fiction",
    "Romance",
    "Childrens Fiction",
    "Paranormal",
    "Contemporary",
    "Rom-Com",
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/books/latest");
        const sortedBooks = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBooks(sortedBooks);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching books", err);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks =
    selectedCategory === "All"
      ? books
      : books.filter(
          (book) =>
            book.category &&
            book.category.toLowerCase().trim() ===
              selectedCategory.toLowerCase().trim()
        );

  return (
    <div style={styles.page}>
      {/* Category toggle with arrow */}
      <div
        style={styles.categoryToggle}
        onClick={() => setShowCategories(!showCategories)}
      >
        Categories
        <span style={styles.arrow}>{showCategories ? "▲" : "▼"}</span>
      </div>

      {/* Category bar with smooth expand/collapse */}
      <div
        style={{
          ...styles.categoryContainer,
          maxHeight: showCategories ? "300px" : "0px", // enough height to fit buttons
          opacity: showCategories ? 1 : 0,
          padding: showCategories ? "10px 0" : "0px",
          overflow: "hidden",
          transition: "all 0.4s ease",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              ...styles.categoryBtn,
              backgroundColor: selectedCategory === cat ? "#7a4a2e" : "#fff",
              color: selectedCategory === cat ? "#fff" : "#7a4a2e",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <h2 style={styles.heading}>New Arrivals</h2>

      {loading && <p style={styles.status}>Loading books...</p>}
      {!loading && filteredBooks.length === 0 && (
        <p style={styles.status}>No books available</p>
      )}

      <div style={styles.grid}>
        {filteredBooks.map((book) => (
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
    backgroundColor: "#f4efe9",
    minHeight: "100vh",
  },

  categoryToggle: {
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "10px",
    cursor: "pointer",
    userSelect: "none",
    color: "#3b2f2f",
  },

  arrow: {
    fontSize: "14px",   // smaller
    color: "#a1867b",   // lighter
    marginLeft: "6px",
  },

  categoryContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "35px",
  },

  categoryBtn: {
    padding: "8px 14px",
    borderRadius: "20px",
    border: "1px solid #7a4a2e",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s ease",
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
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
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

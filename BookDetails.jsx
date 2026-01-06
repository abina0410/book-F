import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../apis/api";

const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
  if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
  return Math.floor(seconds / 86400) + "d ago";
};

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const savedLike = localStorage.getItem(`liked_${id}`);
    if (savedLike === "true") setLiked(true);
  }, [id]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const handleRent = async () => {
    if (!book.available) return alert("Book already rented");
    try {
      await api.post("/rentals/request", { bookId: book._id });
      alert("Book rented successfully!");
      setBook({ ...book, available: false });
    } catch {
      alert("Failed to rent");
    }
  };

  const handleLike = () => {
    const newLike = !liked;
    setLiked(newLike);
    localStorage.setItem(`liked_${id}`, newLike);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      setCommentLoading(true);
      await api.post(`/comments/${id}`, { text: commentText });
      setCommentText("");
      fetchComments();
    } catch {
      alert("Login required to comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch {
      alert("Failed to delete comment");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!book) return <h2 style={{ textAlign: "center" }}>Book not found</h2>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img src={book.image} alt={book.title} style={styles.image} />
        <div style={styles.info}>
          <h2 style={styles.title}>{book.title}</h2>
          <p><b>Author:</b> {book.author}</p>
          <p><b>Category:</b> {book.category}</p>
          <p><b>Year:</b> {book.year}</p>
          <p><b>ISBN:</b> {book.isbn}</p>
          <p><b>Price:</b> ₹{book.price}</p>
          <p><b>Available:</b> {book.available ? "Available" : "Rented"}</p>

          <div style={styles.buttons}>
            <button onClick={handleLike} style={styles.likeBtn}>
              {liked ? "❤️ Liked" : "🤍 Like"}
            </button>

            <button
              onClick={handleRent}
              style={{
                ...styles.rentBtn,
                backgroundColor: book.available ? "#8b5e3c" : "#999",
              }}
              disabled={!book.available}
            >
              Rent
            </button>
          </div>
        </div>
      </div>

      <div style={commentLayout.container}>
        <div style={commentLayout.inner}>
          <h3 style={commentStyles.heading}> Reader Reviews</h3>

          <div style={commentStyles.inputCard}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              style={commentStyles.textarea}
            />
            <button
              onClick={handleAddComment}
              style={commentStyles.postBtn}
              disabled={commentLoading}
            >
              {commentLoading ? "Posting..." : "Post"}
            </button>
          </div>

          {comments.length === 0 && <p style={commentStyles.empty}>No comments yet </p>}

          {comments.map((c) => (
            <div key={c._id} style={commentStyles.commentCard}>
              <div style={commentStyles.avatar}>
                {c.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div style={commentStyles.commentContent}>
                <div style={commentStyles.usernameRow}>
                  <span style={commentStyles.username}>{c.user?.name || "User"}</span>
                  <span style={commentStyles.time}>{timeAgo(c.createdAt)}</span>
                </div>
                <p style={commentStyles.text}>{c.text}</p>
                {c.user?._id === userId && (
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    style={commentStyles.deleteBtn}
                    title="Delete comment"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    padding: "40px", 
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#fdf8f5", 
    minHeight: "100vh" 
  },
  card: { display: "flex", gap: "30px", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", maxWidth: "900px", background: "#fff", width: "100%" },
  image: { width: "300px", height: "420px", objectFit: "cover", borderRadius: "10px" },
  info: { flex: 1, fontSize: "18px", lineHeight: "1.6" },
  title: { fontSize: "30px", fontWeight: "bold", color: "#4b2e2e", marginBottom: "12px" },
  buttons: { display: "flex", gap: "15px", marginTop: "20px" },
  likeBtn: { padding: "10px 20px", borderRadius: "8px", border: "1px solid #8b5e3c", background: "white", color: "#8b5e3c", fontWeight: "bold", cursor: "pointer" },
  rentBtn: { padding: "10px 20px", borderRadius: "8px", border: "none", color: "white", fontWeight: "bold", cursor: "pointer" },
};

const commentLayout = {
  container: { display: "flex", justifyContent: "center", marginTop: "40px", width: "100%" },
  inner: { maxWidth: "900px", width: "100%" },
};

const commentStyles = {
  heading: { fontSize: "22px", fontWeight: "600", marginBottom: "18px", color: "#4b2e2e" },
  inputCard: { display: "flex", gap: "8px", marginBottom: "25px" },
  textarea: { flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e0d5c8", background: "#fff", fontSize: "15px", resize: "none" },
  postBtn: { padding: "8px 20px", borderRadius: "12px", border: "none", background: "#8b5e3c", color: "white", fontWeight: "600", cursor: "pointer" },
  empty: { color: "#8a7f72", fontStyle: "italic" },
  commentCard: { display: "flex", gap: "12px", marginBottom: "16px", alignItems: "flex-start" },
  avatar: { width: "38px", height: "38px", borderRadius: "50%", background: "#4b2e2e", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "14px" },
  commentContent: { 
    flex: 1, 
    background: "#ffffff", // Changed to White for contrast
    border: "1px solid #e0d5c8", // Subtle border to separate from background
    borderRadius: "12px", 
    padding: "12px 16px", 
    position: "relative",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)" // Very light shadow for depth
  },
  usernameRow: { display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" },
  username: { fontWeight: "600", color: "#4b2e2e" },
  time: { fontSize: "12px", color: "#999" },
  text: { fontSize: "15px", margin: 0, color: "#333" },
  deleteBtn: { position: "absolute", top: "10px", right: "10px", border: "none", background: "transparent", cursor: "pointer", fontSize: "14px", opacity: 0.6 },
};

export default BookDetails;

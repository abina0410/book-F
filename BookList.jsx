import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../apis/api";

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/books/latest"); 
        setBooks(res.data);
        console.log(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching books:", err);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) return <p>Loading books...</p>;
  if (!books.length) return <p>No books available</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
      {books.map((book) => (
        <div
          key={book._id}
          onClick={() => navigate(`/book/${book._id}`)}
          style={{
            width: "180px",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
            cursor: "pointer"
          }}
        >
          {book.image && (
            <img
              src={book.image}
              alt={book.title}
              style={{ width: "150px", height: "200px", objectFit: "cover", marginBottom: "10px" }}
            />
          )}
          <h4>{book.title}</h4>
          <p>{book.author}</p>
          {/* <p>{book.Price}</p> */}
          <p><b>Year:</b> {book.Year}</p>
          <p><b>ISBN:</b> {book.isbn}</p>
        </div>
      ))}
    </div>
  );
}

export default BookList;
	
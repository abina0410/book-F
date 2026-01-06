import { useEffect, useState } from "react";
import api from "../apis/api";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get("/books").then(res => setBooks(res.data));
  }, []);

  return (
    <>
      <h2>All Books</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {books.map(book => (
          <div key={book._id} style={{
            border: "1px solid #ccc",
            padding: "15px",
            width: "250px",
            borderRadius: "8px"
          }}>
            <h4>{book.title}</h4>
            <p>{book.author}</p>
            <p>{book.category}</p>
            <p>₹{book.price}</p>
            <p>{book.available ? "Available" : "Rented"}</p>
          </div>
        ))}
      </div>
    </>
  );
}
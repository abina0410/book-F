import { useEffect, useState, useRef } from "react";
import api from "../apis/api";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "",
    year: "",
    isbn: "",
    price: "",
    image: "",
    available: true,
  });
  const [editingBookId, setEditingBookId] = useState(null);

  const formRef = useRef(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const booksRes = await api.get("/admin/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(booksRes.data);

      const usersRes = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(usersRes.data);

      const rentalsRes = await api.get("/admin/rentals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRentals(rentalsRes.data);
    } catch (err) {
      console.error("Fetch Data Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalUsers = users.length;
  const totalBooks = books.length;
  const availableBooks = books.filter((b) => b.available).length;
  const activeRentals = rentals.filter((r) => r.status === "rented").length;

  const toggleAvailability = async (book) => {
    await api.put(
      `/admin/books/${book._id}`,
      { available: !book.available },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    fetchData();
  };

  const deleteBook = async (id) => {
    await api.delete(`/admin/books/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchData();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete User Error:", err);
      alert("Failed to delete user");
    }
  };

  const startEdit = (book) => {
    setEditingBookId(book._id);
    setNewBook(book);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleEditBook = async () => {
    await api.put(`/admin/books/${editingBookId}`, newBook, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    resetForm();
    fetchData();
  };

  const handleAddBook = async () => {
    await api.post("/admin/books", newBook, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    resetForm();
    fetchData();
  };

  const resetForm = () => {
    setEditingBookId(null);
    setNewBook({
      title: "",
      author: "",
      category: "",
      year: "",
      isbn: "",
      price: "",
      image: "",
      available: true,
    });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f4ee" }}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}> Bookish Admin</h2>

        {["dashboard", "books", "users", "rentals"].map((tab) => (
          <div
            key={tab}
            style={activeTab === tab ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      <div style={styles.mainContent}>
        {activeTab === "dashboard" && (
          <>
            <h2 ref={formRef} style={styles.sectionTitle}>
              {editingBookId ? "Edit Book" : "Add New Book"}
            </h2>

            <div style={styles.form}>
              {["title", "author", "category", "year", "isbn", "price"].map(
                (field) => (
                  <input
                    key={field}
                    placeholder={field.toUpperCase()}
                    value={newBook[field]}
                    onChange={(e) =>
                      setNewBook({ ...newBook, [field]: e.target.value })
                    }
                    style={styles.input}
                  />
                )
              )}

              <input
                placeholder="IMAGE URL"
                value={newBook.image}
                onChange={(e) =>
                  setNewBook({ ...newBook, image: e.target.value })
                }
                style={styles.input}
              />

              <button
                style={styles.primaryBtn}
                onClick={editingBookId ? handleEditBook : handleAddBook}
              >
                {editingBookId ? "Update Book" : "Add Book"}
              </button>
            </div>

            <h2 style={styles.sectionTitle}>Books List</h2>

            <div style={styles.grid}>
              {books.map((book) => (
                <div key={book._id} style={styles.card}>
                  <img
                    src={
                      book.image ||
                      "https://via.placeholder.com/200x260?text=No+Image"
                    }
                    alt={book.title}
                    style={styles.bookImage}
                  />
                  <h3>{book.title}</h3>
                  <p><b>Author:</b> {book.author}</p>
                  <span
                    style={
                      book.available
                        ? { background: "#f5e6da", color: "#6b4a2b", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" }
                        : { background: "#fdecea", color: "#b71c1c", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" }
                    }
                  >
                    {book.available ? "Available" : "Rented"}
                  </span>

                  <div style={styles.cardButtons}>
                    <button
                      style={styles.outlineBtn}
                      onClick={() => toggleAvailability(book)}
                    >
                      Toggle Status
                    </button>
                    <button
                      style={styles.outlineBtn}
                      onClick={() => startEdit(book)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.dangerBtn}
                      onClick={() => deleteBook(book._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "books" && (
          <>
            <h2 style={styles.sectionTitle}>All Books</h2>

            <div style={styles.grid}>
              {books.map((book) => (
                <div key={book._id} style={styles.card}>
                  <img
                    src={
                      book.image ||
                      "https://via.placeholder.com/200x260?text=No+Image"
                    }
                    alt={book.title}
                    style={styles.bookImage}
                  />

                  <h3 style={{ marginBottom: "6px" }}>{book.title}</h3>

                  <p><b>Author:</b> {book.author}</p>
                  <p><b>Category:</b> {book.category || "—"}</p>
                  <p><b>Year:</b> {book.year || "—"}</p>
                  <p><b>ISBN:</b> {book.isbn || "—"}</p>
                  <p><b>Price:</b> {book.price ? `₹${book.price}` : "—"}</p>

                  <span
                    style={
                      book.available
                        ? {
                            background: "#f5e6da",
                            color: "#6b4a2b",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "600",
                          }
                        : {
                            background: "#fdecea",
                            color: "#b71c1c",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "600",
                          }
                    }
                  >
                    {book.available ? "Available" : "Rented"}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "users" && (
          <>
            <h2 style={styles.sectionTitle}>Users</h2>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Rentals</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const userRentals = rentals.filter(
                      (r) => r.userId?._id === u._id
                    ).length;

                    return (
                      <tr key={u._id}>
                        <td style={styles.td}><b>{u.name}</b></td>
                        <td style={styles.td}>{u.email}</td>
                        <td style={styles.td}>
                          <span style={{
                            background: "#f5e6da",
                            color: "#6b4a2b",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}>
                            {u.isAdmin ? "ADMIN" : "USER"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span
                            style={
                              u.isBlocked
                                ? { background: "#fdecea", color: "#b71c1c", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" }
                                : { background: "#f5e6da", color: "#6b4a2b", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" }
                            }
                          >
                            {u.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td style={styles.td}>{userRentals}</td>
                        <td style={styles.td}>
                          <div style={{ display: "flex", gap: "10px" }}>
                            {/* Block/Unblock button */}
                            <button
                              style={
                                u.isBlocked
                                  ? { border: "1px solid #b71c1c", color: "#b71c1c", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", background: "#fdecea" }
                                  : { border: "1px solid #6b4a2b", color: "#6b4a2b", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", background: "#f5e6da" }
                              }
                              onClick={async () => {
                                const token = localStorage.getItem("token");
                                const res = await api.patch(
                                  `/admin/users/${u._id}/block`,
                                  {},
                                  { headers: { Authorization: `Bearer ${token}` } }
                                );
                                setUsers(users.map((user) =>
                                  user._id === u._id ? res.data.user : user
                                ));
                              }}
                            >
                              {u.isBlocked ? "Unblock" : "Block"}
                            </button>

                            {/* Delete button */}
                            <button
                              style={{
                                border: "1px solid #b71c1c",
                                color: "#b71c1c",
                                padding: "6px 12px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                background: "#fdecea",
                              }}
                              onClick={() => deleteUser(u._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "rentals" && (
          <>
            <h2 style={styles.sectionTitle}>Rentals</h2>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Book</th>
                    <th style={styles.th}>User</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Rented On</th>
                    <th style={styles.th}>Return Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.map(
                    (r) =>
                      r.bookId && (
                        <tr key={r._id}>
                          <td style={styles.td}><b>{r.bookId.title}</b></td>
                          <td style={styles.td}>{r.userId?.name}</td>
                          <td style={styles.td}>
                            <span
                              style={
                                r.status === "rented"
                                  ? { background: "#fff3cd", color: "#856404", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" }
                                  : { background: "#d4edda", color: "#155724", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" }
                              }
                            >
                              {r.status}
                            </span>
                          </td>
                          <td style={styles.td}>
                            {r.createdAt
                              ? new Date(r.createdAt).toLocaleDateString()
                              : "—"}
                          </td>

                          <td style={styles.td}>
                            {r.status === "returned" && r.updatedAt
                              ? new Date(r.updatedAt).toLocaleDateString()
                              : "—"}
                          </td>

                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  sidebar: {
    width: "240px",
    background: "linear-gradient(180deg, #3e2c1c, #6b4a2b)",
    color: "#fff",
    padding: "24px",
  },
  logo: { marginBottom: "30px", fontFamily: "serif" },
  tab: { padding: "12px", borderRadius: "8px", cursor: "pointer" },
  activeTab: {
    padding: "12px",
    background: "#d4a373",
    color: "#3e2c1c",
    borderRadius: "8px",
    fontWeight: "bold",
  },
  mainContent: { flex: 1, padding: "30px" },
  sectionTitle: { fontFamily: "serif", marginBottom: "15px" },
  form: {
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "#fffaf2",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "30px",
  },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #ccc" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))",
    gap: "20px",
  },
  card: { background: "#fff", padding: "18px", borderRadius: "14px" },
  bookImage: {
    width: "100%",
    height: "260px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  cardButtons: { display: "flex", gap: "8px", marginTop: "12px" },
  primaryBtn: {
    background: "#6b4a2b",
    color: "#fff",
    border: "none",
    padding: "8px",
    borderRadius: "8px",
  },
  outlineBtn: {
    border: "1px solid #6b4a2b",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  dangerBtn: {
    background: "#b71c1c",
    color: "#fff",
    border: "none",
    padding: "8px",
    borderRadius: "8px",
  },
  tableWrapper: {
    background: "#fff",
    borderRadius: "14px",
    padding: "20px",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "12px", borderBottom: "1px solid #eee" },
  td: { padding: "12px", borderBottom: "1px solid #f0f0f0" },
};

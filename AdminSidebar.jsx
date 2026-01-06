export default function AdminSidebar({ activeTab, setActiveTab }) {
  return (
    <div style={styles.sidebar}>
      <h2 style={{ marginBottom: "20px" }}>Admin</h2>

      <div
        style={activeTab === "dashboard" ? styles.active : styles.tab}
        onClick={() => setActiveTab("dashboard")}
      >
        Dashboard
      </div>

      <div
        style={activeTab === "books" ? styles.active : styles.tab}
        onClick={() => setActiveTab("books")}
      >
        Books
      </div>

      <div
        style={activeTab === "users" ? styles.active : styles.tab}
        onClick={() => setActiveTab("users")}
      >
        Users
      </div>

      <div
        style={activeTab === "rentals" ? styles.active : styles.tab}
        onClick={() => setActiveTab("rentals")}
      >
        Rentals
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    background: "#1e293b",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
    position: "fixed",  // <-- fix sidebar
    top: 0,             // <-- align to top
    left: 0,            // <-- align to left
    overflowY: "auto", 
  },
  tab: {
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    marginBottom: "8px",
  },
  active: {
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    background: "#4A90E2",
    marginBottom: "8px",
  },
};
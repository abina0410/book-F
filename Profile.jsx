import { useEffect, useState } from "react";
import api from "../apis/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await api.get("/profile/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setUser(res.data);
    setForm({
      name: res.data.name,
      place: res.data.place,
      age: res.data.age,
      education: res.data.education,
      phoneNumber : res.data.phoneNumber,
    }); 
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const res = await api.put("/profile/me", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUser((prev) => ({
        ...prev,
        ...res.data,
      }));

      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  if (!user) return <div style={styles.loading}>Loading your profile...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header Section with Warm Shade */}
        <div style={styles.header}>
          <div style={styles.avatar}>
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1 }}>
            <div style={styles.nameRow}>
              {isEditing ? (
                <input
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                  style={styles.nameInput}
                />
              ) : (
                <h2 style={styles.name}>{user.name}</h2>
              )}

              <span
                style={{
                  ...styles.badge,
                  ...(user.isAdmin ? styles.adminBadge : styles.userBadge),
                }}
              >
                {user.isAdmin ? "Admin" : "User"}
              </span>
            </div>
            <p style={styles.email}>{user.email}</p>
          </div>
        </div>

        {/* Info Content Section */}
        <div style={styles.infoSection}>
          {fields.map(({ key, label }) => (
            <div key={key} style={styles.row}>
              <span style={styles.label}>{label}</span>

              {isEditing ? (
                <input
                  name={key}
                  value={form[key] || ""}
                  onChange={handleChange}
                  style={styles.input}
                />
              ) : (
                <span style={styles.value}>{user[key] || "-"}</span>
              )}
            </div>
          ))}

          {/* Rented Books Count */}
          <div style={styles.row}>
            <span style={styles.label}>Rented Books</span>
            <span style={styles.rentedBadge}>
              {user.rentedBooksCount ?? 0}
            </span>
          </div>
        </div>

        {/* Footer with Espresso Buttons */}
        <div style={styles.footer}>
          {!isEditing ? (
            <button style={styles.primary} onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button style={styles.primary} onClick={handleSave}>
                Save Changes
              </button>
              <button
                style={styles.secondary}
                onClick={() => {
                  setIsEditing(false);
                  setForm({
                    name: user.name,
                    place: user.place,
                    age: user.age,
                    education: user.education,
                    phoneNumber: user.phoneNumber,
                  });
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const fields = [
  { key: "place", label: "Place" },
  { key: "age", label: "Age" },
  { key: "education", label: "Education" },
  { key: "phoneNumber", label: "Phone" },
];

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "60px 20px",
    background: "#fdfaf5", // Parchment background
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    color: "#5d4037",
    fontSize: "18px"
  },
  card: {
    width: "100%",
    maxWidth: "550px",
    background: "#f2ece4", // Warm greyish-brown shade inside
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(93, 64, 55, 0.12)",
    border: "1px solid #d7ccc8",
    height: "fit-content"
  },
  header: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    padding: "30px",
    background: "rgba(255, 255, 255, 0.4)", // Subtly lighter header area
    borderBottom: "1px solid #d7ccc8",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#5d4037", // Rich Espresso
    color: "#fff",
    fontSize: "32px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
  },
  nameRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap"
  },
  name: {
    margin: 0,
    color: "#2d1b15",
    fontSize: "26px",
    fontWeight: "700"
  },
  nameInput: {
    fontSize: "20px",
    fontWeight: "600",
    border: "1px solid #d7ccc8",
    borderRadius: "6px",
    padding: "6px 10px",
    outline: "none",
    color: "#2d1b15",
    background: "#fff"
  },
  badge: {
    padding: "4px 10px",
    fontSize: "11px",
    borderRadius: "20px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  adminBadge: {
    background: "#2d1b15",
    color: "#fff",
  },
  userBadge: {
    background: "#d7ccc8",
    color: "#5d4037",
  },
  email: {
    margin: "4px 0 0 0",
    color: "#8d6e63",
    fontSize: "15px",
  },
  infoSection: {
    padding: "10px 30px"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    borderBottom: "1px solid rgba(215, 204, 200, 0.5)",
  },
  label: {
    fontWeight: "600",
    color: "#8d6e63", // Muted brown label
    fontSize: "15px"
  },
  value: {
    color: "#2d1b15",
    fontWeight: "500",
    fontSize: "16px"
  },
  rentedBadge: {
    fontWeight: "700",
    background: "#5d4037",
    color: "#fff",
    padding: "4px 14px",
    borderRadius: "20px",
    fontSize: "14px",
  },
  input: {
    width: "60%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #d7ccc8",
    fontSize: "14px",
    outline: "none",
    color: "#2d1b15"
  },
  footer: {
    padding: "20px 30px 30px 30px",
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  },
  primary: {
    background: "#6d4c41", // Matches "Back to Home" button
    color: "#fff",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    transition: "background 0.2s ease"
  },
  secondary: {
    background: "transparent",
    border: "1px solid #8d6e63",
    color: "#8d6e63",
    padding: "10px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px"
  },
};
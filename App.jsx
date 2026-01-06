import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import BookDetails from "./pages/BookDetails";
import Rentals from "./pages/Rentals";
import AdminDashboard from "./pages/AdminDashboard";
import SearchPage from "./pages/SearchPage"; // ✅ import SearchPage

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Sync admin state with localStorage
  useEffect(() => {
    const adminFlag = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminFlag);
  }, [isAuth]);

  return (
    <>
      {/* Navbar visible only after login */}
      {isAuth && <Navbar setIsAuth={setIsAuth} />}

      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            isAuth ? (
              <Navigate to={isAdmin ? "/admin" : "/home"} />
            ) : (
              <Login setIsAuth={setIsAuth} />
            )
          }
        />

        {/* SIGNUP */}
        <Route path="/signup" element={<Signup />} />

        {/* USER ROUTES */}
        <Route
          path="/home"
          element={
            isAuth && !isAdmin ? <Home /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/profile"
          element={
            isAuth && !isAdmin ? <Profile /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/book/:id"
          element={
            isAuth && !isAdmin ? <BookDetails /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/rentals"
          element={
            isAuth && !isAdmin ? <Rentals /> : <Navigate to="/login" />
          }
        />

        {/* ✅ Search Page */}
        <Route
          path="/search"
          element={
            isAuth && !isAdmin ? <SearchPage /> : <Navigate to="/login" />
          }
        />

        {/* ADMIN ROUTE */}
        <Route
          path="/admin"
          element={
            isAuth && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}
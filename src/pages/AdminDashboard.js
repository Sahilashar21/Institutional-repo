

// export default function AdminDashboard() {
//   return <h2>Admin Dashboard - Protected Route</h2>;
// }

import React from "react";
import Navbar from "../components/Navbar";
import HeroCarousel from "../components/HeroCarousel";
import ResourcesSection from "../components/ResourcesSection";


export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // or use `useNavigate` from react-router
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}></div>
      <HeroCarousel />
      <ResourcesSection />
      
      <h2 style={{ fontWeight: "bold" }}>Admin Dashboard - Protected Route</h2>
      {/* <h2 style={{ padding: "2rem" }}>Admin Dashboard - Protected Route</h2> */}
      
    </>
  );
}

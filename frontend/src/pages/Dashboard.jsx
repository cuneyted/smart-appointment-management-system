import { useEffect, useState } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  if (!user) {
    return null;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">SmartBook</div>
        <div className="nav-actions">
          <button className="btn btn-outline" onClick={handleLogout}>Log out</button>
        </div>
      </nav>

      <main className="dashboard-page">
        <div className="dashboard-header">
          <span className="section-label">DASHBOARD</span>
          <h1>Welcome, {user.name}</h1>
          <p>Manage your SmartBook account and appointments.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <span>ACCOUNT</span>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <strong>{user.role}</strong>
          </div>

          <div className="dashboard-card">
            <span>APPOINTMENTS</span>
            <h2>No appointments yet</h2>
            <p>Your upcoming bookings will appear here.</p>
            <button className="btn btn-primary">Book an Appointment</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

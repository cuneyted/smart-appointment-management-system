import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    setUser(JSON.parse(storedUser));

    async function loadAppointments() {
      try {
        const response = await fetch("http://localhost:5000/api/appointments/my", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load appointments.");
        }

        setAppointments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
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
          <button className="btn btn-outline" onClick={handleLogout}>
            Log out
          </button>
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
            <h2>Your bookings</h2>
            <p>Your upcoming bookings will appear here.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/services")}
            >
              Book an Appointment
            </button>
          </div>
        </div>

        <section className="dashboard-appointments">
          <div className="dashboard-section-heading">
            <span>YOUR APPOINTMENTS</span>
            <h2>Booking history</h2>
          </div>

          {loading && <p>Loading appointments...</p>}
          {error && <p className="dashboard-error">{error}</p>}

          {!loading && !error && appointments.length === 0 && (
            <div className="dashboard-empty">
              <h3>No appointments yet</h3>
              <p>Choose a service to make your first booking.</p>
              <button className="btn btn-primary" onClick={() => navigate("/services")}>
                Browse Services
              </button>
            </div>
          )}

          {!loading && !error && appointments.length > 0 && (
            <div className="appointment-list">
              {appointments.map((appointment) => (
                <div className="appointment-card" key={appointment.id}>
                  <div>
                    <span className="appointment-label">SERVICE</span>
                    <h3>{appointment.service_name}</h3>
                    <p>
                      {String(appointment.date).slice(0, 10)} · {String(appointment.time).slice(0, 5)}
                    </p>
                  </div>

                  <div className="appointment-right">
                    <span className={`appointment-status status-${appointment.status}`}>
                      {appointment.status}
                    </span>
                    <span>{appointment.duration_minutes} min</span>
                    <strong>{Number(appointment.price).toFixed(2)} zł</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

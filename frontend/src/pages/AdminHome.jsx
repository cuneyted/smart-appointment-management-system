import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";

function AdminHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAppointments() {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load dashboard data.");
      }

      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  const customers = new Set(
    appointments.map((item) => item.customer_email)
  );

  const pending = appointments.filter((item) => item.status === "pending");
  const confirmed = appointments.filter((item) => item.status === "confirmed");

  const today = new Date();
  const todayValue = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  const todayAppointments = appointments.filter(
    (item) => String(item.date).slice(0, 10) === todayValue
  );

  const recentAppointments = [...appointments]
    .sort((a, b) => {
      const dateA = `${String(a.date).slice(0, 10)}T${String(a.time).slice(0, 5)}`;
      const dateB = `${String(b.date).slice(0, 10)}T${String(b.time).slice(0, 5)}`;
      return dateB.localeCompare(dateA);
    })
    .slice(0, 5);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="admin-home-page">
      <nav className="admin-home-nav">
        <div className="admin-home-brand">
          <div className="admin-home-logo">CE</div>
          <div>
            <strong>CE Digital Labs</strong>
            <span>SMARTBOOK ADMINISTRATION</span>
          </div>
        </div>

        <div className="admin-home-nav-actions">
          <span>Administrator</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </nav>

      <main className="admin-home-content">
        <section className="admin-home-heading">
          <span className="admin-home-eyebrow">ADMINISTRATOR WORKSPACE</span>
          <h1>Welcome back, {user?.name || "Administrator"}.</h1>
          <p>
            Manage your appointment platform, review customer requests
            and monitor daily activity.
          </p>
        </section>

        <section className="admin-home-stats">
          <div>
            <span>Total customers</span>
            <strong>{loading ? "—" : customers.size}</strong>
          </div>
          <div>
            <span>Total appointments</span>
            <strong>{loading ? "—" : appointments.length}</strong>
          </div>
          <div>
            <span>Pending requests</span>
            <strong>{loading ? "—" : pending.length}</strong>
          </div>
          <div>
            <span>Today's appointments</span>
            <strong>{loading ? "—" : todayAppointments.length}</strong>
          </div>
        </section>

        <section className="admin-home-actions">
          <button
            className="admin-home-primary"
            onClick={() => navigate("/admin/appointments")}
          >
            <span className="admin-home-action-icon">01</span>
            <span>
              <strong>Appointment management</strong>
              <small>Review bookings and update appointment statuses.</small>
            </span>
            <b>→</b>
          </button>

          <button
            className="admin-home-secondary"
            onClick={() => navigate("/services")}
          >
            <span className="admin-home-action-icon">02</span>
            <span>
              <strong>Service catalogue</strong>
              <small>View the services currently displayed on SmartBook.</small>
            </span>
            <b>→</b>
          </button>
        </section>

        <section className="admin-home-recent">
          <div className="admin-home-section-heading">
            <div>
              <span className="admin-home-eyebrow">LATEST ACTIVITY</span>
              <h2>Recent appointments</h2>
            </div>
            <button onClick={() => navigate("/admin/appointments")}>
              View all →
            </button>
          </div>

          {loading && <p className="admin-home-message">Loading appointments...</p>}
          {error && <p className="admin-home-error">{error}</p>}

          {!loading && !error && recentAppointments.length === 0 && (
            <p className="admin-home-message">No appointments have been received yet.</p>
          )}

          {!loading && !error && recentAppointments.map((item) => (
            <div className="admin-home-recent-row" key={item.id}>
              <div>
                <strong>{item.customer_name}</strong>
                <span>{item.service_name}</span>
              </div>
              <div>
                <span>{String(item.date).slice(0, 10)} · {String(item.time).slice(0, 5)}</span>
                <span className={`admin-home-status status-${item.status}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}

          {!loading && !error && (
            <div className="admin-home-footer">
              {confirmed.length} confirmed appointments · {pending.length} awaiting review
              <button onClick={loadAppointments}>Refresh data</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminHome;

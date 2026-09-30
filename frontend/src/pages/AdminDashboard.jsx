import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  async function loadAppointments() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/appointments", {
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

  useEffect(() => {
    loadAppointments();
  }, []);

  async function updateStatus(id, status) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update appointment.");
      }

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status: data.status }
            : appointment
        )
      );
    } catch (error) {
      setError(error.message);
    }
  }

  const today = new Date().toISOString().split("T")[0];
  const customers = new Set(appointments.map((appointment) => appointment.customer_email));
  const pending = appointments.filter((appointment) => appointment.status === "pending");
  const confirmed = appointments.filter((appointment) => appointment.status === "confirmed");
  const todayAppointments = appointments.filter((appointment) => String(appointment.date).slice(0, 10) === today);

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesStatus = filter === "all" || appointment.status === filter;
    const searchText = search.toLowerCase();
    const matchesSearch =
      appointment.customer_name.toLowerCase().includes(searchText) ||
      appointment.customer_email.toLowerCase().includes(searchText) ||
      appointment.service_name.toLowerCase().includes(searchText);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="admin-page">
      <nav className="admin-navbar">
        <div>
          <strong>CE Digital Labs</strong>
          <span>SmartBook Admin</span>
        </div>

        <div className="admin-nav-actions">
          <button onClick={() => navigate("/services")}>Services</button>
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Log out
          </button>
        </div>
      </nav>

      <main className="admin-content">
        <section className="admin-heading">
          <span>ADMINISTRATION</span>
          <h1>Appointment management.</h1>
          <p>Review customer requests and manage appointment status.</p>
        </section>

        <section className="admin-stats">
          <div><span>Customers</span><strong>{customers.size}</strong></div>
          <div><span>Pending</span><strong>{pending.length}</strong></div>
          <div><span>Confirmed</span><strong>{confirmed.length}</strong></div>
          <div><span>Today</span><strong>{todayAppointments.length}</strong></div>
        </section>

        <section className="appointments-panel">
          <div className="appointments-top">
            <div>
              <h2>Appointment requests</h2>
              <p>Customer bookings received through SmartBook.</p>
            </div>

            <button className="refresh-button" onClick={loadAppointments}>
              Refresh
            </button>
          </div>

          <div className="appointment-filters">
            <input
              type="search"
              placeholder="Search customer, email or service..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {loading && <p className="admin-message">Loading appointments...</p>}
          {error && <p className="admin-error">{error}</p>}

          {!loading && !error && filteredAppointments.length === 0 && (
            <div className="admin-empty">No appointments found.</div>
          )}

          {!loading && !error && filteredAppointments.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>
                        <strong>{appointment.customer_name}</strong>
                        {appointment.notes && <small>{appointment.notes}</small>}
                      </td>
                      <td>{appointment.customer_email}</td>
                      <td>{appointment.service_name}</td>
                      <td>{String(appointment.date).slice(0, 10)}</td>
                      <td>{String(appointment.time).slice(0, 5)}</td>
                      <td>
                        <span className={`status status-${appointment.status}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {appointment.status === "pending" && (
                            <button onClick={() => updateStatus(appointment.id, "confirmed")}>
                              Confirm
                            </button>
                          )}
                          {appointment.status !== "cancelled" && appointment.status !== "completed" && (
                            <button
                              className="danger-action"
                              onClick={() => updateStatus(appointment.id, "cancelled")}
                            >
                              Cancel
                            </button>
                          )}
                          {appointment.status === "confirmed" && (
                            <button onClick={() => updateStatus(appointment.id, "completed")}>
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;

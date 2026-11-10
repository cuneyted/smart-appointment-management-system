import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [booking, setBooking] = useState({
    serviceId: "",
    date: "",
    time: "",
    notes: ""
  });

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  function getToday() {
    const today = new Date();
    return [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");
  }

  function dateKey(value) {
    return String(value || "").slice(0, 10);
  }

  function formatDate(value) {
    const date = dateKey(value);
    if (!date) return "Date unavailable";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  async function loadData(token, initialLoad = false) {
    if (initialLoad) setLoading(true);
    setError("");

    try {
      const [appointmentsResponse, servicesResponse] = await Promise.all([
        fetch("http://localhost:5000/api/appointments/my", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch("http://localhost:5000/api/services")
      ]);

      const appointmentsData = await appointmentsResponse.json();
      const servicesData = await servicesResponse.json();

      if (!appointmentsResponse.ok) {
        throw new Error(appointmentsData.message || "Could not load your appointments.");
      }

      if (!servicesResponse.ok) {
        throw new Error(servicesData.message || "Could not load services.");
      }

      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setServices(servicesData.services || []);
    } catch (err) {
      setError(err.message);
    } finally {
      if (initialLoad) setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    let storedUser = null;

    try {
      storedUser = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      storedUser = null;
    }

    if (!token || !storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    if (storedUser.role === "admin") {
      navigate("/admin", { replace: true });
      return;
    }

    setUser(storedUser);
    loadData(token, true);
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  function handleBookingChange(event) {
    setBooking((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  async function handleBooking(event) {
    event.preventDefault();
    setBookingError("");
    setBookingSuccess("");
    setBookingLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId: booking.serviceId,
          date: booking.date,
          time: booking.time,
          notes: booking.notes
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create appointment.");
      }

      setBooking({ serviceId: "", date: "", time: "", notes: "" });
      setBookingSuccess("Your appointment request has been submitted successfully.");

      await loadData(token);
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  }

  const today = getToday();

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      dateKey(appointment.date) >= today &&
      appointment.status !== "cancelled"
  );

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending"
  );

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  );

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = `${dateKey(a.date)} ${String(a.time).slice(0, 5)}`;
    const dateB = `${dateKey(b.date)} ${String(b.time).slice(0, 5)}`;
    return dateB.localeCompare(dateA);
  });

  if (!user) return null;

  return (
    <div className="customer-dashboard">
      <nav className="customer-navbar">
        <div className="customer-brand">
          <div className="customer-brand-mark">CE</div>
          <div>
            <strong>CE Digital Labs</strong>
            <span>SMARTBOOK PLATFORM</span>
          </div>
        </div>

        <div className="customer-nav-actions">
          <button onClick={() => navigate("/services")}>Services</button>
          <button className="customer-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </nav>

      <main className="customer-content">
        <section className="customer-welcome">
          <div>
            <span className="customer-eyebrow">PERSONAL WORKSPACE</span>
            <h1>Welcome back, {user.name}.</h1>
            <p>
              Your personal space to manage appointments and book new services.
            </p>
          </div>

          <div className="customer-profile">
            <div className="customer-avatar">
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
              <small>Customer account</small>
            </div>
          </div>
        </section>

        <section className="customer-stats">
          <div className="customer-stat-card">
            <span>Total bookings</span>
            <strong>{loading ? "—" : appointments.length}</strong>
            <small>All your requests</small>
          </div>
          <div className="customer-stat-card">
            <span>Upcoming</span>
            <strong>{loading ? "—" : upcomingAppointments.length}</strong>
            <small>Future appointments</small>
          </div>
          <div className="customer-stat-card">
            <span>Pending</span>
            <strong>{loading ? "—" : pendingAppointments.length}</strong>
            <small>Awaiting confirmation</small>
          </div>
          <div className="customer-stat-card">
            <span>Confirmed</span>
            <strong>{loading ? "—" : confirmedAppointments.length}</strong>
            <small>Approved appointments</small>
          </div>
        </section>

        <section className="customer-booking-intro">
          <div>
            <span className="customer-eyebrow">BOOK A SERVICE</span>
            <h2>What can we help you with?</h2>
            <p>
              Choose one of our services and request a time that works for you.
            </p>
          </div>

          <button
            className="customer-primary-button"
            onClick={() => {
              setShowBooking((current) => !current);
              setBookingError("");
              setBookingSuccess("");
            }}
          >
            {showBooking ? "Close booking" : "+ New appointment"}
          </button>
        </section>

        {showBooking && (
          <section className="customer-booking-panel">
            <div className="customer-panel-heading">
              <div>
                <span className="customer-eyebrow">NEW REQUEST</span>
                <h2>Book your appointment</h2>
              </div>
              <span className="customer-step">01 / 01</span>
            </div>

            <form onSubmit={handleBooking}>
              <div className="customer-form-grid">
                <div>
                  <label htmlFor="serviceId">Select service</label>
                  <select
                    id="serviceId"
                    name="serviceId"
                    value={booking.serviceId}
                    onChange={handleBookingChange}
                    required
                  >
                    <option value="">Choose a service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} · {service.duration_minutes} min · {Number(service.price).toFixed(2)} zł
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="date">Preferred date</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={booking.date}
                    min={today}
                    onChange={handleBookingChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="time">Preferred time</label>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    value={booking.time}
                    onChange={handleBookingChange}
                    required
                  />
                </div>
              </div>

              <div className="customer-notes-field">
                <label htmlFor="notes">Additional notes <span>(optional)</span></label>
                <textarea
                  id="notes"
                  name="notes"
                  value={booking.notes}
                  onChange={handleBookingChange}
                  placeholder="Tell us about your requirements..."
                  rows="3"
                />
              </div>

              {bookingError && (
                <div className="customer-alert customer-alert-error">{bookingError}</div>
              )}

              {bookingSuccess && (
                <div className="customer-alert customer-alert-success">{bookingSuccess}</div>
              )}

              <button
                className="customer-primary-button"
                type="submit"
                disabled={bookingLoading || services.length === 0}
              >
                {bookingLoading ? "Submitting request..." : "Submit appointment request"}
              </button>
            </form>
          </section>
        )}

        <section className="customer-history">
          <div className="customer-history-heading">
            <div>
              <span className="customer-eyebrow">YOUR ACTIVITY</span>
              <h2>My appointments</h2>
              <p>View and track the status of your appointment requests.</p>
            </div>
            <button onClick={() => loadData(localStorage.getItem("token"))}>
              Refresh
            </button>
          </div>

          {loading && (
            <div className="customer-empty-state">Loading your appointments...</div>
          )}

          {error && (
            <div className="customer-alert customer-alert-error">{error}</div>
          )}

          {!loading && !error && sortedAppointments.length === 0 && (
            <div className="customer-empty-state">
              <div className="customer-empty-icon">＋</div>
              <h3>Your next appointment starts here.</h3>
              <p>You have not made any bookings yet. Choose a service to get started.</p>
              <button
                className="customer-primary-button"
                onClick={() => setShowBooking(true)}
              >
                Book your first appointment
              </button>
            </div>
          )}

          {!loading && !error && sortedAppointments.length > 0 && (
            <div className="customer-appointment-list">
              {sortedAppointments.map((appointment) => (
                <article className="customer-appointment-card" key={appointment.id}>
                  <div className="customer-appointment-date">
                    <span>{formatDate(appointment.date)}</span>
                    <strong>{String(appointment.time).slice(0, 5)}</strong>
                  </div>

                  <div className="customer-appointment-info">
                    <span className="customer-appointment-label">SERVICE</span>
                    <h3>{appointment.service_name}</h3>
                    <p>
                      {appointment.duration_minutes} minutes
                      {appointment.notes ? ` · ${appointment.notes}` : ""}
                    </p>
                  </div>

                  <div className="customer-appointment-price">
                    <strong>{Number(appointment.price).toFixed(2)} zł</strong>
                    <span>Appointment price</span>
                  </div>

                  <span className={`customer-status customer-status-${appointment.status}`}>
                    {appointment.status}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="customer-footer">
          <span>© {new Date().getFullYear()} CE Digital Labs</span>
          <span>SmartBook · Your appointments, organized.</span>
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;

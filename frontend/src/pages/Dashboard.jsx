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

  async function loadData(token) {
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
        throw new Error(appointmentsData.message || "Could not load appointments.");
      }

      if (!servicesResponse.ok) {
        throw new Error(servicesData.message || "Could not load services.");
      }

      setAppointments(appointmentsData);
      setServices(servicesData.services || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    setUser(JSON.parse(storedUser));
    loadData(token);
  }, [navigate]);

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch("http://localhost:5000/api/services");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load services.");
        }

        setServices(data.services || []);
      } catch (error) {
        setError(error.message);
      }
    }

    loadServices();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  function handleBookingChange(event) {
    setBooking({
      ...booking,
      [event.target.name]: event.target.value
    });
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

      setBookingSuccess("Your appointment request has been submitted.");
      setBooking({ serviceId: "", date: "", time: "", notes: "" });
      setAppointments((current) => [...current, data]);

      await loadData(token);
    } catch (error) {
      setBookingError(error.message);
    } finally {
      setBookingLoading(false);
    }
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
            <h2>Book a service</h2>
            <p>Choose a service and request a convenient appointment time.</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowBooking(!showBooking);
                setBookingError("");
                setBookingSuccess("");
              }}
            >
              {showBooking ? "Close Booking" : "Book an Appointment"}
            </button>
          </div>
        </div>

        {showBooking && (
          <section className="dashboard-booking">
            <div className="dashboard-section-heading">
              <span>NEW APPOINTMENT</span>
              <h2>Book your appointment</h2>
              <p>Select a service, date and time for your request.</p>
            </div>

            <form onSubmit={handleBooking}>
              <div className="booking-fields">
                <div>
                  <label htmlFor="serviceId">Service</label>
                  <select
                    id="serviceId"
                    name="serviceId"
                    value={booking.serviceId}
                    onChange={handleBookingChange}
                    required
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - {Number(service.price).toFixed(2)} zł
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="date">Date</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={booking.date}
                    onChange={handleBookingChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="time">Time</label>
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

              <div className="booking-notes">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={booking.notes}
                  onChange={handleBookingChange}
                  placeholder="Tell us anything we should know..."
                  rows="4"
                ></textarea>
              </div>

              {bookingError && <div className="dashboard-error">{bookingError}</div>}
              {bookingSuccess && <div className="dashboard-success">{bookingSuccess}</div>}

              <button className="btn btn-primary" type="submit" disabled={bookingLoading}>
                {bookingLoading ? "Submitting..." : "Submit Appointment"}
              </button>
            </form>
          </section>
        )}

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
              <p>Choose a service above to make your first booking.</p>
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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";

function localDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function AdminHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [customerMessage, setCustomerMessage] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(() => localDateKey(new Date()));

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [appointmentResponse, customerResponse] = await Promise.all([
        fetch("http://localhost:5000/api/appointments", { headers }),
        fetch("http://localhost:5000/api/admin/customers", { headers })
      ]);

      const appointmentData = await appointmentResponse.json();
      const customerData = await customerResponse.json();

      if (!appointmentResponse.ok) {
        throw new Error(
          appointmentData.message || "Could not load appointments."
        );
      }

      if (!customerResponse.ok) {
        throw new Error(
          customerData.message || "Could not load customers."
        );
      }

      setAppointments(Array.isArray(appointmentData) ? appointmentData : []);
      setCustomers(customerData.customers || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  async function handleDeleteCustomer(customer) {
    const confirmed = window.confirm(
      `Delete ${customer.name} (${customer.email})?\\n\\nThis will permanently delete the customer account and all appointments associated with it.`
    );

    if (!confirmed) return;

    const customerId = String(customer.id);
    setDeletingCustomer(customerId);
    setCustomerMessage("");
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/customers/${customerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete customer.");
      }

      setCustomerMessage(`${customer.name} was deleted successfully.`);
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingCustomer(null);
    }
  }

  const today = localDateKey(new Date());

  const pending = appointments.filter(
    (item) => item.status === "pending"
  );

  const confirmed = appointments.filter(
    (item) => item.status === "confirmed"
  );

  const todayAppointments = appointments.filter(
    (item) => String(item.date).slice(0, 10) === today
  );

  const firstDayOffset =
    (new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      1
    ).getDay() + 6) % 7;

  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0
  ).getDate();

  const monthLabel = calendarMonth.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric"
  });

  const selectedAppointments = appointments
    .filter((item) => String(item.date).slice(0, 10) === selectedDate)
    .sort((a, b) => String(a.time).localeCompare(String(b.time)));

  const filteredCustomers = customers.filter((customer) => {
    const query = customerSearch.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query)
    );
  });

  const recentAppointments = [...appointments]
    .sort((a, b) => {
      const dateA = `${String(a.date).slice(0, 10)}T${String(a.time).slice(0, 5)}`;
      const dateB = `${String(b.date).slice(0, 10)}T${String(b.time).slice(0, 5)}`;
      return dateB.localeCompare(dateA);
    })
    .slice(0, 5);

  function changeMonth(direction) {
    const nextMonth = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + direction,
      1
    );

    setCalendarMonth(nextMonth);
    setSelectedDate(localDateKey(nextMonth));
  }

  function formatDate(value) {
    const date = String(value).slice(0, 10);
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
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
          <button onClick={() => navigate("/admin/appointments")}>
            Appointments
          </button>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </nav>

      <main className="admin-home-content">
        <section className="admin-home-heading">
          <span className="admin-home-eyebrow">ADMINISTRATOR WORKSPACE</span>
          <h1>Welcome back, {user?.name || "Administrator"}.</h1>
          <p>
            Manage appointments, explore customer activity and monitor
            your SmartBook platform.
          </p>
        </section>

        <section className="admin-home-stats">
          <div>
            <span>Total customers</span>
            <strong>{loading ? "—" : customers.length}</strong>
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

        {error && <p className="admin-home-error">{error}</p>}

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
              <small>View the available SmartBook services.</small>
            </span>
            <b>→</b>
          </button>
        </section>

        <section className="admin-calendar-panel">
          <div className="admin-calendar-heading">
            <div>
              <span className="admin-home-eyebrow">SCHEDULE OVERVIEW</span>
              <h2>Appointment calendar</h2>
              <p>Select a date to view its customer bookings.</p>
            </div>

            <div className="admin-calendar-navigation">
              <button onClick={() => changeMonth(-1)} aria-label="Previous month">
                ‹
              </button>
              <strong>{monthLabel}</strong>
              <button onClick={() => changeMonth(1)} aria-label="Next month">
                ›
              </button>
            </div>
          </div>

          <div className="admin-calendar-layout">
            <div className="admin-calendar">
              <div className="admin-calendar-grid">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div className="admin-calendar-weekday" key={day}>
                    {day}
                  </div>
                ))}

                {Array.from({ length: firstDayOffset }).map((_, index) => (
                  <div className="admin-calendar-blank" key={`blank-${index}`} />
                ))}

                {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => {
                  const dateValue = localDateKey(
                    new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth(),
                      day
                    )
                  );

                  const dayCount = appointments.filter(
                    (item) => String(item.date).slice(0, 10) === dateValue
                  ).length;

                  const selected = selectedDate === dateValue;

                  return (
                    <button
                      key={dateValue}
                      className={`admin-calendar-day ${selected ? "selected" : ""} ${today === dateValue ? "today" : ""}`}
                      onClick={() => setSelectedDate(dateValue)}
                    >
                      <span>{day}</span>
                      {dayCount > 0 && (
                        <small>{dayCount} {dayCount === 1 ? "booking" : "bookings"}</small>
                      )}
                      {dayCount > 0 && <i />}
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className="admin-selected-day">
              <span className="admin-home-eyebrow">SELECTED DAY</span>
              <h3>{formatDate(selectedDate)}</h3>
              <p className="admin-selected-count">
                {selectedAppointments.length} appointment
                {selectedAppointments.length === 1 ? "" : "s"}
              </p>

              {selectedAppointments.length === 0 && (
                <div className="admin-calendar-empty">
                  No bookings for this date.
                </div>
              )}

              {selectedAppointments.map((item) => (
                <div className="admin-calendar-booking" key={item.id}>
                  <strong>{String(item.time).slice(0, 5)}</strong>
                  <div>
                    <b>{item.customer_name}</b>
                    <span>{item.customer_email}</span>
                    <small>{item.service_name}</small>
                    <em className={`status-${item.status}`}>{item.status}</em>
                  </div>
                </div>
              ))}

              <button
                className="admin-calendar-manage"
                onClick={() => navigate("/admin/appointments")}
              >
                Manage appointments →
              </button>
            </aside>
          </div>
          <div className="admin-calendar-legend">
            <span><i /> Days with bookings</span>
            <span><i className="legend-today" /> Today</span>
            <span><i className="legend-selected" /> Selected date</span>
          </div>
        </section>

        <section className="admin-customers-panel">
          <div className="admin-home-section-heading">
            <div>
              <span className="admin-home-eyebrow">CUSTOMER MANAGEMENT</span>
              <h2>Customer directory</h2>
              <p>All registered customer accounts, including customers without bookings.</p>
            </div>
            <span className="admin-customer-total">
              {loading ? "—" : customers.length} customers
            </span>
          </div>

          {customerMessage && (
            <p className="admin-customer-success">{customerMessage}</p>
          )}

          <div className="admin-customer-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search by customer name or email..."
              value={customerSearch}
              onChange={(event) => setCustomerSearch(event.target.value)}
            />
          </div>

          {loading && <p className="admin-home-message">Loading customers...</p>}

          {!loading && filteredCustomers.length === 0 && (
            <p className="admin-home-message">No customers found.</p>
          )}

          {!loading && filteredCustomers.length > 0 && (
            <div className="admin-customer-list">
              {filteredCustomers.map((customer) => (
                <div className="admin-customer-row" key={customer.id}>
                  <div className="admin-customer-avatar">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="admin-customer-info">
                    <strong>{customer.name}</strong>
                    <span>{customer.email}</span>
                  </div>
                  <div className="admin-customer-date">
                    <span>Registered</span>
                    <strong>
                      {customer.created_at
                        ? formatDate(customer.created_at)
                        : "—"}
                    </strong>
                  </div>
                  <span className="admin-customer-role">Customer</span>
                  <button
                    className="admin-customer-delete"
                    onClick={() => handleDeleteCustomer(customer)}
                    disabled={deletingCustomer === String(customer.id)}
                  >
                    {deletingCustomer === String(customer.id) ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          )}
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

          {!loading && recentAppointments.length === 0 && (
            <p className="admin-home-message">No appointments have been received yet.</p>
          )}

          {!loading && recentAppointments.map((item) => (
            <div className="admin-home-recent-row" key={item.id}>
              <div>
                <strong>{item.customer_name}</strong>
                <span>{item.service_name}</span>
              </div>
              <div>
                <span>
                  {String(item.date).slice(0, 10)} · {String(item.time).slice(0, 5)}
                </span>
                <span className={`admin-home-status status-${item.status}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}

          {!loading && (
            <div className="admin-home-footer">
              {confirmed.length} confirmed appointments · {pending.length} awaiting review
              <button onClick={loadDashboard}>Refresh data</button>
            </div>
          )}
        </section>

        <footer className="admin-home-footer-note">
          © {new Date().getFullYear()} CE Digital Labs · SmartBook Administration
        </footer>
      </main>
    </div>
  );
}

export default AdminHome;

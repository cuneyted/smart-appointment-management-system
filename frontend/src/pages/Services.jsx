import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";

function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [booking, setBooking] = useState({
    date: "",
    time: "",
    notes: ""
  });
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch("http://localhost:5000/api/services");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load services.");
        }

        setServices(data.services);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  function handleBookClick(service) {
    setSelectedService(service);
    setBookingError("");
    setBookingSuccess("");

    setTimeout(() => {
      const bookingSection = document.querySelector(".booking-section");
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }

  function handleChange(event) {
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
          serviceId: selectedService.id,
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
      setBooking({ date: "", time: "", notes: "" });
    } catch (error) {
      setBookingError(error.message);
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <div className="services-page">
      <nav className="navbar">
        <div className="logo">SmartBook</div>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/services" className="active">Services</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>

        <div className="nav-actions">
          <button className="btn btn-outline" onClick={() => navigate("/login")}>
            Log in
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>
      </nav>

      <main>
        <section className="services-hero">
          <span className="section-label">OUR SERVICES</span>
          <h1>Choose a service that works for you.</h1>
          <p>
            Browse available services and choose a convenient time for your appointment.
          </p>
        </section>

        <section className="services-content">
          {loading && <p className="services-message">Loading services...</p>}

          {error && <p className="services-error">{error}</p>}

          {!loading && !error && services.length === 0 && (
            <div className="empty-services">
              <h2>No services available</h2>
              <p>Please check back later.</p>
            </div>
          )}

          {!loading && !error && services.length > 0 && (
            <div className="services-grid">
              {services.map((service) => (
                <article className="service-card" key={service.id}>
                  <div className="service-card-top">
                    <span className="service-tag">AVAILABLE</span>
                    <span className="service-price">{Number(service.price).toFixed(2)} zł</span>
                  </div>

                  <h2>{service.name}</h2>
                  <p>{service.description || "Professional service appointment."}</p>

                  <div className="service-details">
                    <span>{service.duration_minutes} minutes</span>
                    <span>Online booking</span>
                  </div>

                  <button
                    className="service-button"
                    onClick={() => handleBookClick(service)}
                  >
                    Book this service
                  </button>
                </article>
              ))}
            </div>
          )}

          {selectedService && (
            <section className="booking-section">
              <div className="booking-heading">
                <span className="section-label">BOOKING REQUEST</span>
                <h2>{selectedService.name}</h2>
                <p>
                  Choose your preferred date and time for this appointment.
                </p>
              </div>

              <form className="booking-form" onSubmit={handleBooking}>
                <div className="booking-summary">
                  <div>
                    <span>Service</span>
                    <strong>{selectedService.name}</strong>
                  </div>
                  <div>
                    <span>Duration</span>
                    <strong>{selectedService.duration_minutes} min</strong>
                  </div>
                  <div>
                    <span>Price</span>
                    <strong>{Number(selectedService.price).toFixed(2)} zł</strong>
                  </div>
                </div>

                <div className="booking-fields">
                  <div>
                    <label htmlFor="date">Date</label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={booking.date}
                      onChange={handleChange}
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
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Tell us anything we should know before the appointment..."
                  value={booking.notes}
                  onChange={handleChange}
                  rows="5"
                ></textarea>

                {bookingError && <div className="booking-error">{bookingError}</div>}
                {bookingSuccess && <div className="booking-success">{bookingSuccess}</div>}

                <div className="booking-actions">
                  <button
                    type="button"
                    className="booking-cancel"
                    onClick={() => setSelectedService(null)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="booking-submit"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? "Submitting..." : "Submit Appointment"}
                  </button>
                </div>
              </form>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

export default Services;

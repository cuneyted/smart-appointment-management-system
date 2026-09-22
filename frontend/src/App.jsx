import './App.css';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">SmartBook</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="nav-actions">
          <button className="btn btn-outline">Log in</button>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="badge">Simple. Fast. Convenient.</span>

            <h1>
              Book your appointments
              <span> with ease.</span>
            </h1>

            <p>
              SmartBook is a modern appointment management platform that
              makes scheduling simple for customers and service providers.
            </p>

            <div className="hero-actions">
              <button className="btn btn-primary btn-large">
                Book an Appointment
              </button>
              <button className="btn btn-secondary btn-large">
                Explore Services
              </button>
            </div>

            <div className="hero-stats">
              <div>
                <strong>24/7</strong>
                <small>Online Booking</small>
              </div>
              <div>
                <strong>Easy</strong>
                <small>Appointment Management</small>
              </div>
              <div>
                <strong>Secure</strong>
                <small>User Authentication</small>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="calendar-header">
              <div>
                <small>Upcoming appointment</small>
                <h3>September 24, 2026</h3>
              </div>
              <div className="calendar-icon">24</div>
            </div>

            <div className="appointment-item">
              <div className="appointment-time">10:30</div>
              <div>
                <strong>Consultation</strong>
                <p>Professional Service</p>
              </div>
              <span className="status">Confirmed</span>
            </div>

            <div className="appointment-item">
              <div className="appointment-time">14:00</div>
              <div>
                <strong>Follow-up Meeting</strong>
                <p>Online Session</p>
              </div>
              <span className="status pending">Pending</span>
            </div>
          </div>
        </section>

        <section className="features" id="services">
          <div className="section-heading">
            <span className="section-label">FEATURES</span>
            <h2>Everything you need to manage appointments</h2>
            <p>
              A simple and reliable system designed for both users and
              administrators.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-number">01</div>
              <h3>Easy Booking</h3>
              <p>
                Users can browse available services and book appointments
                in just a few steps.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-number">02</div>
              <h3>Appointment Management</h3>
              <p>
                View, cancel and manage upcoming appointments from one
                personal dashboard.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-number">03</div>
              <h3>Admin Dashboard</h3>
              <p>
                Administrators can manage services, users and appointments
                through a dedicated panel.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer id="contact">
        <div>
          <strong>SmartBook</strong>
          <p>Smart appointment management for modern services.</p>
        </div>
        <span>© 2026 SmartBook</span>
      </footer>
    </div>
  );
}

export default App;

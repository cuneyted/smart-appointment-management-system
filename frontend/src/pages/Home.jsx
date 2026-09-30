import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-mark"><span>CE</span></div>
          <div className="brand-copy">
            <strong>CE Digital Labs</strong>
            <small>SmartBook Platform</small>
          </div>
        </div>

        <div className="nav-links">
          <a href="/services">Services</a>
          <a href="#platform">Platform</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">
              <span></span>
              SMARTBOOK · APPOINTMENT MANAGEMENT PLATFORM
            </div>

            <h1>
              Appointments,
              <br />
              <span>managed intelligently.</span>
            </h1>

            <p>
              SmartBook is a modern appointment management platform by CE
              Digital Labs, designed to make scheduling simple, efficient and
              reliable.
            </p>

            <div className="hero-actions">
              <button
                className="btn btn-primary btn-large"
                onClick={() => navigate("/services")}
              >
                Explore Services
              </button>

              <button
                className="btn btn-secondary btn-large"
                onClick={() => navigate("/register")}
              >
                Create an Account
              </button>
            </div>

            <div className="hero-meta">
              <div>
                <strong>01</strong>
                <small>Easy scheduling</small>
              </div>

              <div>
                <strong>02</strong>
                <small>Secure access</small>
              </div>

              <div>
                <strong>03</strong>
                <small>Clear management</small>
              </div>
            </div>
          </div>

          <div className="product-preview">
            <div className="preview-header">
              <div>
                <span>SMARTBOOK</span>
                <h3>Appointment Overview</h3>
              </div>

              <div className="preview-dot"></div>
            </div>

            <div className="preview-stats">
              <div className="preview-stat">
                <span>Today</span>
                <strong>04</strong>
              </div>

              <div className="preview-stat">
                <span>Confirmed</span>
                <strong>03</strong>
              </div>

              <div className="preview-stat">
                <span>Pending</span>
                <strong>01</strong>
              </div>
            </div>

            <div className="preview-list">
              <div className="preview-item">
                <div className="preview-time">10:30</div>

                <div className="preview-info">
                  <strong>IT Consultation</strong>
                  <span>60 minutes</span>
                </div>

                <div className="preview-status confirmed">
                  Confirmed
                </div>
              </div>

              <div className="preview-item">
                <div className="preview-time">13:00</div>

                <div className="preview-info">
                  <strong>Web Development</strong>
                  <span>60 minutes</span>
                </div>

                <div className="preview-status pending">
                  Pending
                </div>
              </div>

              <div className="preview-item">
                <div className="preview-time">16:30</div>

                <div className="preview-info">
                  <strong>Career Consultation</strong>
                  <span>45 minutes</span>
                </div>

                <div className="preview-status confirmed">
                  Confirmed
                </div>
              </div>
            </div>

            <div className="preview-footer">
              <span>Live system preview</span>
              <span>CE Digital Labs</span>
            </div>
          </div>
        </section>

        <section className="brand-strip">
          <span>BUILT FOR MODERN SERVICE BUSINESSES</span>
          <span>SECURE</span>
          <span>SCALABLE</span>
          <span>RESPONSIVE</span>
        </section>

        <section className="features" id="platform">
          <div className="section-heading">
            <div className="eyebrow">THE PLATFORM</div>

            <h2>A cleaner way to manage every appointment.</h2>

            <p>
              SmartBook brings bookings, services and appointment management
              together in one streamlined platform.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <span className="feature-index">01</span>
              <h3>Simple Booking</h3>
              <p>
                Customers can discover services and schedule appointments
                without unnecessary steps.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-index">02</span>
              <h3>Central Management</h3>
              <p>
                Administrators can manage services, availability and
                appointment requests from one place.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-index">03</span>
              <h3>Secure Access</h3>
              <p>
                Role-based access and authenticated sessions keep account and
                booking data protected.
              </p>
            </article>
          </div>
        </section>

        <section className="about-section" id="about">
          <div>
            <div className="eyebrow">CE DIGITAL LABS</div>
            <h2>Digital solutions from Warsaw.</h2>
          </div>

          <p>
            CE Digital Labs develops practical digital tools for modern
            service businesses. SmartBook is built around one simple idea:
            better scheduling creates a better customer experience.
          </p>
        </section>
      </main>

      <footer>
        <div>
          <strong>CE Digital Labs</strong>
          <p>Digital services & appointment technology · Warsaw, Poland</p>
        </div>

        <span>© 2026 CE Digital Labs</span>
      </footer>
    </div>
  );
}

export default Home;

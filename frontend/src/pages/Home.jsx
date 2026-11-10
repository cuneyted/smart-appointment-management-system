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
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
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


          <div className="hero-visual">
            <img
              className="hero-photo"
              src="/src/assets/smartbook-team.jpg"
              alt="Professionals collaborating in a modern office"
            />

            <div className="hero-photo-label">
              <span>SMARTBOOK · APPOINTMENT MANAGEMENT</span>
              <h3>A better way to manage every appointment.</h3>
              <p>From the first booking to the final confirmation.</p>
            </div>

            <div className="hero-floating-card">
              <div className="hero-floating-icon">✓</div>
              <div>
                <strong>Booking experience</strong>
                <small>Simple. Organized. Reliable.</small>
              </div>
              <span className="hero-floating-dot"></span>
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

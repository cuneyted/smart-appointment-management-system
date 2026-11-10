import { useNavigate } from "react-router-dom";
import "./InfoPages.css";

function About() {
  const navigate = useNavigate();

  return (
    <div className="info-page">
      <nav className="info-navbar">
        <a className="info-brand" href="/">
          <span>CE</span>
          <div>
            <strong>CE Digital Labs</strong>
            <small>SMARTBOOK PLATFORM</small>
          </div>
        </a>

        <div className="info-links">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a className="active" href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>

        <button onClick={() => navigate("/login")}>Log in</button>
      </nav>

      <main>
        <section className="info-hero">
          <span className="info-eyebrow">ABOUT SMARTBOOK</span>
          <h1>
            Better scheduling.
            <br />
            <span>Better experiences.</span>
          </h1>
          <p>
            SmartBook is a web-based appointment management system
            designed to make service booking simple, organized and reliable.
          </p>
          <button onClick={() => navigate("/services")}>
            Explore our services →
          </button>
        </section>

        <section className="info-content">
          <div className="info-intro">
            <span className="info-eyebrow">OUR PURPOSE</span>
            <h2>One platform for every appointment.</h2>
            <p>
              SmartBook brings customers, services and appointment
              administration together in one place. Customers can explore
              available services, request appointments and track their
              booking status. Administrators can review requests, manage
              customer information and organize appointments through
              a dedicated dashboard.
            </p>
          </div>

          <div className="info-feature-grid">
            <article>
              <span>01</span>
              <h3>For customers</h3>
              <p>
                Explore available services, request appointments,
                manage your account and follow your booking history.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>For administrators</h3>
              <p>
                Review appointment requests, update booking statuses,
                view customer information and use the appointment calendar.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>Simple and organized</h3>
              <p>
                A clear interface and centralized management make
                the appointment process easier to follow.
              </p>
            </article>
          </div>
        </section>

        <section className="info-tech">
          <div>
            <span className="info-eyebrow">TECHNOLOGY STACK</span>
            <h2>Built with modern web technologies.</h2>
            <p>
              SmartBook uses a separate frontend, backend and relational
              database to support its main application features.
            </p>
          </div>

          <div className="info-tech-tags">
            {[
              "React",
              "JavaScript",
              "Node.js",
              "Express.js",
              "PostgreSQL",
              "JWT Authentication"
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section className="info-content">
          <div className="info-intro">
            <span className="info-eyebrow">ACADEMIC PROJECT</span>
            <h2>Web-Based Appointment Management System.</h2>
            <p>
              SmartBook is developed as a bachelor's thesis project
              in Computer Science Engineering. The project focuses on
              designing and implementing a practical web application
              for appointment booking and administration.
            </p>
            <button
              className="contact-link"
              onClick={() => navigate("/contact")}
            >
              Project information →
            </button>
          </div>
        </section>
      </main>

      <footer className="info-footer">
        <strong>CE Digital Labs · SmartBook</strong>
        <span>
          Academic project · Warsaw, Poland
        </span>
      </footer>
    </div>
  );
}

export default About;

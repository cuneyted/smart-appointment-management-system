import { useNavigate } from "react-router-dom";
import "./InfoPages.css";

function Contact() {
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
          <a href="/about">About</a>
          <a className="active" href="/contact">Contact</a>
        </div>

        <button onClick={() => navigate("/login")}>Log in</button>
      </nav>

      <main className="contact-content">
        <section className="contact-heading">
          <span className="info-eyebrow">CONTACT & PROJECT INFORMATION</span>
          <h1>Let's connect.</h1>
          <p>
            Interested in SmartBook or want to share feedback?
            Visit the project profile or get in touch through GitHub.
          </p>
        </section>

        <section className="contact-card">
          <div className="contact-icon">↗</div>
          <span className="info-eyebrow">GITHUB PROFILE</span>
          <h2>Explore the developer profile.</h2>
          <p>
            Visit the GitHub profile to explore the developer's
            projects and software development work.
          </p>
          <a
            className="contact-link"
            href="https://github.com/cuneyted"
            target="_blank"
            rel="noreferrer"
          >
            Visit GitHub Profile →
          </a>
        </section>

        <section className="contact-card">
          <div className="contact-icon">✉</div>
          <span className="info-eyebrow">FEEDBACK & QUESTIONS</span>
          <h2>Share your feedback.</h2>
          <p>
            For questions, suggestions or technical feedback about
            SmartBook, visit the project's GitHub repository.
            You can create a new issue to share your message.
          </p>
          <a
            className="contact-link"
            href="https://github.com/cuneyted/smart-appointment-management-system/issues/new"
            target="_blank"
            rel="noreferrer"
          >
            Send Feedback →
          </a>
          <a
            className="contact-secondary-link"
            href="https://github.com/cuneyted/smart-appointment-management-system"
            target="_blank"
            rel="noreferrer"
          >
            View SmartBook Repository
          </a>
        </section>

        <section className="contact-note">
          <h3>Project information</h3>
          <p>
            <strong>Project:</strong> Web-Based Appointment Management System
          </p>
          <p>
            <strong>Platform:</strong> SmartBook
          </p>
          <p>
            <strong>Project concept:</strong> CE Digital Labs
          </p>
          <p>
            <strong>Location:</strong> Warsaw, Poland
          </p>
          <p>
            Developed as a bachelor's thesis project in Computer Science Engineering.
          </p>
        </section>
      </main>

      <footer className="info-footer">
        <strong>CE Digital Labs · SmartBook</strong>
        <span>Academic project · Warsaw, Poland</span>
      </footer>
    </div>
  );
}

export default Contact;

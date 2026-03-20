import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

export default function Landing() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <>
      <Navbar />

      <section
        className="hero-section"
        style={{
          position: "relative",
          backgroundImage: "url('/src/assets/landing-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "white",
          padding: "0 1rem",
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1,
          }}
        ></div>

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "700px",
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? "translateY(0)" : "translateY(20px)",
            transition: "all 1s ease",
          }}
        >
          <h1 className="hero-text" style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            Multilingual Translation Made Easy
          </h1>
          <p className="hero-text" style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
            Translate your text instantly with AI-powered models.
          </p>
          <Link to="/signup">
            <button
              className="hero-button"
              style={{
                padding: "1rem 2rem",
                fontSize: "1.2rem",
                borderRadius: "50px",
                border: "none",
                background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
                color: "white",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.target.style.transform = "scale(1)"}
            >
              Get Started
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

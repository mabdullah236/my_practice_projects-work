import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutUs() {
  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <section
  className="hero-section"
  style={{
    background: "url('/images/about-hero.jpg') center/cover no-repeat",
    height: "50vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "var(--text-color)", // heading visible in both themes
    textAlign: "center",
  }}
>
  <h1 style={{ fontSize: "3rem" }}>About Us</h1>
</section>


      {/* Our Story Section */}
      <section style={{ padding: "4rem 1rem", maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem", textAlign: "center" }}>Our Story</h2>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6", textAlign: "center" }}>
          TranslateAI was founded with a mission to break language barriers using advanced AI translation technologies. Our goal is to make content accessible to everyone, everywhere.
        </p>
      </section>

      {/* Team Section */}
      <section style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Meet Our Team</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            justifyItems: "center",
          }}
        >
          <div className="card">
            <img src="/images/team1.jpg" alt="Team Member" style={{ width: "100%", borderRadius: "8px" }} />
            <h3>Ali Raza</h3>
            <p>CEO & Founder</p>
          </div>
          <div className="card">
            <img src="/images/team2.jpg" alt="Team Member" style={{ width: "100%", borderRadius: "8px" }} />
            <h3>Sara Khan</h3>
            <p>Lead Developer</p>
          </div>
          <div className="card">
            <img src="/images/team3.jpg" alt="Team Member" style={{ width: "100%", borderRadius: "8px" }} />
            <h3>Omar Farooq</h3>
            <p>Product Designer</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

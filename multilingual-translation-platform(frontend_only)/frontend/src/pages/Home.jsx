import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
  className="hero-section"
  style={{
    background: "url('/images/home-hero.jpg') center/cover no-repeat",
    height: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "var(--text-color)", // make heading visible in both themes
    padding: "0 1rem",
  }}
>
  <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
    Welcome to TranslateAI
  </h1>
  <p style={{ fontSize: "1.2rem", maxWidth: "600px", marginBottom: "2rem" }}>
    Multilingual translation platform using AI. Translate content in seconds and reach the world.
  </p>
  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
    <Link
      to="/signup"
      style={{
        padding: "0.8rem 2rem",
        borderRadius: "50px",
        background: "linear-gradient(90deg,#36d1dc,#5b86e5)",
        color: "white",
        fontWeight: "bold",
        textDecoration: "none",
      }}
    >
      Get Started
    </Link>
    <Link
      to="/ourmodels"
      style={{
        padding: "0.8rem 2rem",
        borderRadius: "50px",
        border: "2px solid var(--text-color)", // visible in both themes
        color: "var(--text-color)",           // visible in both themes
        fontWeight: "bold",
        textDecoration: "none",
      }}
    >
      Explore Models
    </Link>
  </div>
</section>


      {/* Features Section */}
      <section style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Our Features</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          <div className="card">
            <h3>Fast Translation</h3>
            <p>Get your content translated instantly in multiple languages.</p>
          </div>
          <div className="card">
            <h3>AI-Powered</h3>
            <p>Advanced AI models ensure accurate and natural translations.</p>
          </div>
          <div className="card">
            <h3>User-Friendly</h3>
            <p>Simple interface to translate, manage, and download your content.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

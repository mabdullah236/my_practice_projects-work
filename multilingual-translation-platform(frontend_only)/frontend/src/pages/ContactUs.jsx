import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: name ? "" : "Name required",
      email: email.includes("@") ? "" : "Valid email required",
      message: message ? "" : "Message required",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(err => err)) return;

    setLoading(true);
    setSuccessMsg("");

    try {
      await new Promise(res => setTimeout(res, 1500)); // Simulate API call
      setSuccessMsg("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setErrors({ form: "Failed to send message. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Contact Us</h1>

        {errors.form && <p style={{ color: "red", textAlign: "center" }}>{errors.form}</p>}
        {successMsg && <p style={{ color: "green", textAlign: "center" }}>{successMsg}</p>}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
            backgroundColor: "var(--card-bg)",
            padding: "2rem",
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
          }}
        >
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Full Name"
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "10px",
                border: "1px solid #ccc",
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
                outline: "none",
                transition: "all 0.3s"
              }}
            />
            {errors.name && <span style={{ color: "red", fontSize: "0.9rem" }}>{errors.name}</span>}
          </div>

          <div style={{ position: "relative" }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "10px",
                border: "1px solid #ccc",
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
                outline: "none",
                transition: "all 0.3s"
              }}
            />
            {errors.email && <span style={{ color: "red", fontSize: "0.9rem" }}>{errors.email}</span>}
          </div>

          <div style={{ position: "relative" }}>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Your Message"
              rows={5}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "10px",
                border: "1px solid #ccc",
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
                outline: "none",
                resize: "vertical",
                transition: "all 0.3s"
              }}
            />
            {errors.message && <span style={{ color: "red", fontSize: "0.9rem" }}>{errors.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "1rem 0",
              borderRadius: "50px",
              border: "none",
              background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
              color: "white",
              fontSize: "1.1rem",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
          >
            {loading ? <Spinner /> : "Send Message"}
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirm) {
      setError("All fields are required");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(res => setTimeout(res, 1200));
      navigate("/dashboard");
    } catch {
      setError("Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ padding: "2rem", display: "flex", justifyContent: "center" }}>
        <form
          onSubmit={handleSignup}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "2rem",
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            maxWidth: "400px",
            width: "100%",
            backgroundColor: "var(--card-bg)"
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Signup</h2>
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              padding: "1rem",
              borderRadius: "10px",
              border: "1px solid #ccc",
              outline: "none",
              transition: "all 0.3s",
              backgroundColor: "var(--bg-color)",
              color: "var(--text-color)"
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              padding: "1rem",
              borderRadius: "10px",
              border: "1px solid #ccc",
              outline: "none",
              transition: "all 0.3s",
              backgroundColor: "var(--bg-color)",
              color: "var(--text-color)"
            }}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            style={{
              padding: "1rem",
              borderRadius: "10px",
              border: "1px solid #ccc",
              outline: "none",
              transition: "all 0.3s",
              backgroundColor: "var(--bg-color)",
              color: "var(--text-color)"
            }}
          />
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
            {loading ? <Spinner /> : "Signup"}
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}

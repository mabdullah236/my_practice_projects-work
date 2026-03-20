import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setData([
        { id: 1, title: "Your Translations", value: 24 },
        { id: 2, title: "Recent Activity", value: 5 },
        { id: 3, title: "Models Used", value: 3 },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "auto" }}>
        <h1 style={{ marginBottom: "2rem", textAlign: "center" }}>Dashboard</h1>

        {loading ? (
          <Spinner />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem",
            }}
          >
            {data.map(card => (
              <div
                key={card.id}
                style={{
                  backgroundColor: "var(--card-bg)",
                  color: "var(--text-color)",
                  padding: "1.5rem",
                  borderRadius: "15px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
                }}
              >
                <h3 style={{ marginBottom: "1rem" }}>{card.title}</h3>
                <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{card.value}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const models = [
  { id: 1, name: "GPT-Translator", description: "High-quality AI translation." },
  { id: 2, name: "Polyglot AI", description: "Supports 100+ languages." },
  { id: 3, name: "QuickTrans", description: "Fast real-time translation." },
];

export default function OurModels() {
  const [selectedModel, setSelectedModel] = useState(null);

  return (
    <>
      <Navbar />
      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Our Models</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          {models.map(model => (
            <div
              key={model.id}
              className="model-card"
              onClick={() => setSelectedModel(model)}
              style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--text-color)",
                borderRadius: "15px",
                padding: "1.5rem",
                textAlign: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
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
              <h3 style={{ marginBottom: "1rem" }}>{model.name}</h3>
              <p style={{ marginBottom: "1.5rem" }}>{model.description}</p>
              <button
                style={{
                  padding: "0.7rem 1.5rem",
                  borderRadius: "50px",
                  border: "none",
                  background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
                  color: "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedModel(model);
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedModel && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              animation: "fadeIn 0.3s",
              zIndex: 1000,
            }}
            onClick={() => setSelectedModel(null)}
          >
            <div
              style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--text-color)",
                padding: "2rem",
                borderRadius: "15px",
                maxWidth: "500px",
                width: "90%",
                textAlign: "center",
                transform: "scale(1)",
                transition: "all 0.3s ease",
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ marginBottom: "1rem" }}>{selectedModel.name}</h2>
              <p>{selectedModel.description}</p>
              <p>More detailed info about the model can go here.</p>
              <button
                style={{
                  marginTop: "1.5rem",
                  padding: "0.7rem 1.5rem",
                  borderRadius: "50px",
                  border: "none",
                  background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
                  color: "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => setSelectedModel(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

      </main>
      <Footer />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}

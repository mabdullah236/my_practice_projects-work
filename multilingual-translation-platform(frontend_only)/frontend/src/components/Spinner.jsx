export default function Spinner() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem"
    }}>
      <div className="loader"></div>
      <style>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

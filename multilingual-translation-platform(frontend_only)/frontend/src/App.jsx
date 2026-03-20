import AppRouter from "./routes/AppRouter";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import "./index.css";

function App() {
  return (
    <HelmetProvider>
      <ThemeContextProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeContextProvider>
    </HelmetProvider>
  );
}

export default App;

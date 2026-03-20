import React from 'react'; // <--- Yeh line zaroori hai
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css'; // Styling ke liye
import './i18n'; // Agar i18n setup kiya tha to
import ErrorBoundary from './components/common/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
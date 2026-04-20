import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// Auth Context
import { AuthProvider } from "./context/AuthContext.jsx";

// CRITICAL: Preload dashboard API data before components mount
// This ensures data is partially/fully loaded by the time Dashboard renders
// IMPORTANT: Use absolute URL to backend (http://localhost:8080/api/...) not relative paths
const token = localStorage.getItem('token')
const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

export const dashboardDataPromise = fetch('http://localhost:8080/api/drivers', {
  headers: authHeaders,
  credentials: 'include'
})
  .then(r => r.json())
  .catch(() => null)

export const racesDataPromise = fetch('http://localhost:8080/api/races', {
  headers: authHeaders,
  credentials: 'include'
})
  .then(r => r.json())
  .catch(() => null)

// Web Vitals tracking — measure real Core Web Vitals metrics
// Dynamic import to avoid blocking startup
import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
  const reportVitals = (metric) => {
    // In production, send to analytics service
    if (window.__REPORT_VITALS) {
      window.__REPORT_VITALS(metric)
    }
  }
  
  onCLS(reportVitals)
  onFID(reportVitals)
  onFCP(reportVitals)
  onLCP(reportVitals)
  onTTFB(reportVitals)
}).catch(() => {
  // web-vitals not available, skip
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
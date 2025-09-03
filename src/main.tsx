import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import SettingsPage from "./pages/SettingsPage";
import JournalPage from "./pages/JournalPage";
import SummaryPage from "./pages/SummaryPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="*" element={<AuthPage />} /> {/* fallback */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

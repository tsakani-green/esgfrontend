import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ClientDashboard from "./pages/ClientDashboard";
import InvoiceWorking from "./pages/InvoiceCreationTest";
import InvoiceManagementSimple from "./pages/InvoiceMUI";
import ClientReports from "./pages/ClientReports";
import ReportGenerator from "./pages/ReportGenerator";
import LiveAIAgent from "./pages/LiveAIAgent";
import AdminClients from "./pages/AdminClients";
import AdminDashboard from "./pages/AdminDashboard";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2E7D32", light: "#4CAF50", dark: "#1B5E20" },
    secondary: { main: "#1976D2", light: "#2196F3", dark: "#0D47A1" },
    background: { default: "#f8f9fa", paper: "#ffffff" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: "none", fontWeight: 600 } } },
    MuiCard: { styleOverrides: { root: { boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: 16 } } },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Client */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<ClientDashboard />} />
            <Route path="/create-invoice" element={<InvoiceWorking />} />
            <Route path="/invoices" element={<InvoiceManagementSimple />} />
            <Route path="/reports" element={<ClientReports />} />
            <Route path="/generate-report" element={<ReportGenerator />} />
            <Route path="/live-ai" element={<LiveAIAgent />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<AdminRoute />}>
          <Route element={<Layout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/clients" element={<AdminClients />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "./context/ThemeContext"; 
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute"; 
import ClaimsList from "./pages/claims/ClaimsList";
import ClaimForm from "./pages/claims/ClaimForm";
import ClaimDetails from "./pages/claims/ClaimDetails";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import CreateOfficer from "./pages/dashboard/CreateOfficer";
import FloatingBackground from "./components/ui/FloatingBackground"; 

function App() {
  return (
    <ThemeProvider>
      {/* 🚀 UPGRADED HIGH-PROMINENCE LAYER TOASTER */}
      <Toaster 
        position="top-right" // 🔑 Shifts the card completely clear of your centered navbar
        containerStyle={{
          top: 40,
          right: 40,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            // 🧱 Stacking Context: Forces the toast to sit on top of the blurred sticky header
            zIndex: 99999,
            
            // 🎨 High-Contrast Charcoal Slate Backing (Crisp visibility in both Light & Dark modes)
            background: '#0f172a', 
            color: '#f8fafc',
            
            // 💎 Glass Definition Details
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            
            // 📐 Shape & Proportions
            borderRadius: '16px',
            padding: '14px 24px',
            fontSize: '14px',
            fontWeight: '700',
            letterSpacing: '-0.01em',
            
            // 👥 Deep Ambient Shadow Projection
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
          },
          
          // ✨ Eye-Catching Left Indicator Accent Stripes
          success: {
            iconTheme: {
              primary: '#22d3ee', // Flagship Electric Cyan Branding
              secondary: '#0f172a',
            },
            style: {
              borderLeft: '4px solid #22d3ee',
            }
          },
          error: {
            iconTheme: {
              primary: '#f43f5e', // Warning Vibrant Rose
              secondary: '#0f172a',
            },
            style: {
              borderLeft: '4px solid #f43f5e',
            }
          }
        }} 
      />
      
      <FloatingBackground />
      
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<ClaimsList />} />
            <Route path="claims" element={<ClaimsList />} />
            <Route path="claims/:id" element={<ClaimDetails />} />
            <Route path="claims/new" element={<ProtectedRoute allowedRoles={["policyholder"]}><ClaimForm /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="create-officer" element={<ProtectedRoute allowedRoles={["admin"]}><CreateOfficer /></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
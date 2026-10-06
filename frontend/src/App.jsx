import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Provider Pages
import ProviderDashboard from './pages/ProviderDashboard';
import NewSurplusPage from './pages/NewSurplusPage';
import SurplusListPage from './pages/SurplusListPage';
import ProviderMatchesPage from './pages/ProviderMatchesPage';
import ProviderHistoryPage from './pages/ProviderHistoryPage';

// Recipient Pages
import RecipientDashboard from './pages/RecipientDashboard';
import NewRequirementPage from './pages/NewRequirementPage';
import RequirementsListPage from './pages/RequirementsListPage';
import RecipientMatchesPage from './pages/RecipientMatchesPage';
import DeliveryTrackingPage from './pages/DeliveryTrackingPage';
import RecipientHistoryPage from './pages/RecipientHistoryPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminVerificationsPage from './pages/AdminVerificationsPage';
import AdminResourcesPage from './pages/AdminResourcesPage';
import AdminRequestsPage from './pages/AdminRequestsPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';

// Shared Pages
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* PROVIDER ROUTES */}
              <Route path="/provider/dashboard" element={
                <ProtectedRoute allowedRoles={['ROLE_PROVIDER', 'ROLE_ADMIN']}>
                  <ProviderDashboard />
                </ProtectedRoute>
              } />
              <Route path="/provider/surplus/new" element={
                <ProtectedRoute allowedRoles={['ROLE_PROVIDER', 'ROLE_ADMIN']}>
                  <NewSurplusPage />
                </ProtectedRoute>
              } />
              <Route path="/provider/surplus" element={
                <ProtectedRoute allowedRoles={['ROLE_PROVIDER', 'ROLE_ADMIN']}>
                  <SurplusListPage />
                </ProtectedRoute>
              } />
              <Route path="/provider/matches" element={
                <ProtectedRoute allowedRoles={['ROLE_PROVIDER', 'ROLE_ADMIN']}>
                  <ProviderMatchesPage />
                </ProtectedRoute>
              } />
              <Route path="/provider/history" element={
                <ProtectedRoute allowedRoles={['ROLE_PROVIDER', 'ROLE_ADMIN']}>
                  <ProviderHistoryPage />
                </ProtectedRoute>
              } />

              {/* RECIPIENT ROUTES */}
              <Route path="/recipient/dashboard" element={
                <ProtectedRoute allowedRoles={['ROLE_RECIPIENT', 'ROLE_ADMIN']}>
                  <RecipientDashboard />
                </ProtectedRoute>
              } />
              <Route path="/recipient/request/new" element={
                <ProtectedRoute allowedRoles={['ROLE_RECIPIENT', 'ROLE_ADMIN']}>
                  <NewRequirementPage />
                </ProtectedRoute>
              } />
              <Route path="/recipient/requests" element={
                <ProtectedRoute allowedRoles={['ROLE_RECIPIENT', 'ROLE_ADMIN']}>
                  <RequirementsListPage />
                </ProtectedRoute>
              } />
              <Route path="/recipient/matches" element={
                <ProtectedRoute allowedRoles={['ROLE_RECIPIENT', 'ROLE_ADMIN']}>
                  <RecipientMatchesPage />
                </ProtectedRoute>
              } />
              <Route path="/recipient/tracking" element={
                <ProtectedRoute allowedRoles={['ROLE_RECIPIENT', 'ROLE_ADMIN']}>
                  <DeliveryTrackingPage />
                </ProtectedRoute>
              } />
              <Route path="/recipient/history" element={
                <ProtectedRoute allowedRoles={['ROLE_RECIPIENT', 'ROLE_ADMIN']}>
                  <RecipientHistoryPage />
                </ProtectedRoute>
              } />

              {/* ADMIN ROUTES */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/verifications" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminVerificationsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/resources" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminResourcesPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/requests" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminRequestsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminAnalyticsPage />
                </ProtectedRoute>
              } />

              {/* SHARED PROTECTED ROUTES */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />

              {/* FALLBACK CATCH-ALL */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      // Redirect based on role
      if (user.role === 'ROLE_PROVIDER') {
        navigate('/provider/dashboard');
      } else if (user.role === 'ROLE_RECIPIENT') {
        navigate('/recipient/dashboard');
      } else if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    }
  };

  const quickDemoLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    try {
      const user = await login(demoEmail, demoPass);
      if (user.role === 'ROLE_PROVIDER') {
        navigate('/provider/dashboard');
      } else if (user.role === 'ROLE_RECIPIENT') {
        navigate('/recipient/dashboard');
      } else if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed.');
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">
            <div className="card border-0 shadow-lg rounded-xl overflow-hidden">
              <div className="row g-0">
                {/* Left Side: Form */}
                <div className="col-md-6 p-4 p-lg-5 bg-white">
                  <div className="mb-4">
                    <Link to="/" className="text-decoration-none text-success fw-bold d-inline-flex align-items-center gap-1 mb-3">
                      <i className="bi bi-arrow-left"></i> Back to Home
                    </Link>
                    <h3 className="fw-bold text-dark mb-1">Welcome back</h3>
                    <p className="text-muted small">Sign in to your LIFELINK organization account</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger py-2 small rounded-3 d-flex align-items-center gap-2">
                      <i className="bi bi-exclamation-circle-fill"></i>
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-secondary">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-envelope text-muted"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control border-start-0"
                          placeholder="name@organization.org"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label small fw-semibold text-secondary">Password</label>
                      </div>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-lock text-muted"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control border-start-0"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary-custom w-100 py-2.5 mb-3 shadow-sm"
                      disabled={loading}
                    >
                      {loading ? (
                        <span><span className="spinner-border spinner-border-sm me-2"></span>Authenticating...</span>
                      ) : (
                        <span>Sign In <i className="bi bi-box-arrow-in-right ms-1"></i></span>
                      )}
                    </button>
                  </form>

                  <div className="text-center small text-muted">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-success fw-bold text-decoration-none">
                      Register Organization
                    </Link>
                  </div>
                </div>

                {/* Right Side: Quick Demo Login Switcher */}
                <div className="col-md-6 p-4 p-lg-5 bg-gradient-dark text-white d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge bg-success text-white px-2.5 py-1 rounded-pill">
                        EVALUATION READY
                      </span>
                      <span className="badge bg-white bg-opacity-10 text-white-50 px-2 py-1 rounded-pill">
                        University Demo
                      </span>
                    </div>
                    <h5 className="fw-bold text-white mb-2">Instant One-Click Login</h5>
                    <p className="text-white-50 small mb-4">
                      Click any role below to automatically authenticate and evaluate the real-world scenario.
                    </p>

                    <div className="d-flex flex-column gap-2 mb-4">
                      {/* Provider Demo Button */}
                      <button
                        type="button"
                        className="btn btn-outline-light text-start p-2.5 border-opacity-25 rounded-3 d-flex align-items-center justify-content-between hover-bg-light"
                        onClick={() => quickDemoLogin('cafeteria@lifelink.org', 'Pass@123')}
                      >
                        <div>
                          <div className="fw-bold text-success fs-7">
                            <i className="bi bi-building me-1"></i> Provider: Campus Cafeteria
                          </div>
                          <div className="text-white-50" style={{ fontSize: '0.75rem' }}>
                            Has 50 portions surplus ready for matching
                          </div>
                        </div>
                        <i className="bi bi-arrow-right-short fs-4"></i>
                      </button>

                      {/* Recipient Demo Button */}
                      <button
                        type="button"
                        className="btn btn-outline-light text-start p-2.5 border-opacity-25 rounded-3 d-flex align-items-center justify-content-between hover-bg-light"
                        onClick={() => quickDemoLogin('shelter@lifelink.org', 'Pass@123')}
                      >
                        <div>
                          <div className="fw-bold text-info fs-7">
                            <i className="bi bi-heart me-1"></i> Recipient A: Hope Shelter
                          </div>
                          <div className="text-white-50" style={{ fontSize: '0.75rem' }}>
                            High priority, 30 portions needed, 1.5 km
                          </div>
                        </div>
                        <i className="bi bi-arrow-right-short fs-4"></i>
                      </button>

                      {/* Recipient C Demo Button */}
                      <button
                        type="button"
                        className="btn btn-outline-light text-start p-2.5 border-opacity-25 rounded-3 d-flex align-items-center justify-content-between hover-bg-light"
                        onClick={() => quickDemoLogin('youthcare@lifelink.org', 'Pass@123')}
                      >
                        <div>
                          <div className="fw-bold text-warning fs-7">
                            <i className="bi bi-people me-1"></i> Recipient C: Youth Care Center
                          </div>
                          <div className="text-white-50" style={{ fontSize: '0.75rem' }}>
                            High priority, 20 portions needed, 3.2 km
                          </div>
                        </div>
                        <i className="bi bi-arrow-right-short fs-4"></i>
                      </button>

                      {/* Admin Demo Button */}
                      <button
                        type="button"
                        className="btn btn-outline-light text-start p-2.5 border-opacity-25 rounded-3 d-flex align-items-center justify-content-between hover-bg-light"
                        onClick={() => quickDemoLogin('admin@lifelink.org', 'Admin@123')}
                      >
                        <div>
                          <div className="fw-bold text-light fs-7">
                            <i className="bi bi-shield-lock me-1"></i> Admin: Central Authority
                          </div>
                          <div className="text-white-50" style={{ fontSize: '0.75rem' }}>
                            Verifications, allocation monitor & analytics
                          </div>
                        </div>
                        <i className="bi bi-arrow-right-short fs-4"></i>
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white bg-opacity-10 rounded-3 text-white-50 small border border-white border-opacity-10">
                    <i className="bi bi-info-circle me-1 text-info"></i>
                    All accounts use pre-seeded realistic data with active matches and historical deliveries.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

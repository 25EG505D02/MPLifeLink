import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGetNotifications, apiGetUnreadCount, apiMarkNotificationAsRead, apiMarkAllNotificationsRead } from '../api/client';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const countRes = await apiGetUnreadCount();
      setUnreadCount(countRes.unreadCount || 0);
      const list = await apiGetNotifications();
      setNotifications(list.slice(0, 6));
    } catch (e) {
      // Background poll failure ignore
    }
  };

  const handleMarkRead = async (id, linkUrl) => {
    try {
      await apiMarkNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, readStatus: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (linkUrl) {
        setShowNotifs(false);
        navigate(linkUrl);
      }
    } catch (e) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await apiMarkAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, readStatus: true })));
      setUnreadCount(0);
    } catch (e) {}
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top py-2">
      <div className="container-fluid px-lg-4">
        {/* Brand */}
        <Link className="navbar-brand navbar-brand-logo text-success" to={user ? (
          user.role === 'ROLE_PROVIDER' ? '/provider/dashboard' :
          user.role === 'ROLE_RECIPIENT' ? '/recipient/dashboard' : '/admin/dashboard'
        ) : '/'}>
          <i className="bi bi-heart-pulse-fill text-danger fs-4"></i>
          <span className="fw-bolder tracking-tight" style={{ letterSpacing: '-0.5px' }}>
            <span className="text-dark">LIFE</span><span className="text-success">LINK</span>
          </span>
          <span className="badge bg-light text-secondary border ms-1 fs-8 d-none d-md-inline" style={{ fontSize: '0.65rem' }}>
            INTELLIGENT REDISTRIBUTION
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          {/* Role Navigation */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-1">
            {!user && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/')}`} to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link nav-link-custom" href="/#how-it-works">How It Works</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link nav-link-custom" href="/#impact">Impact</a>
                </li>
              </>
            )}

            {user?.role === 'ROLE_PROVIDER' && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/provider/dashboard')}`} to="/provider/dashboard">
                    <i className="bi bi-grid-1x2-fill me-1"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/provider/surplus')}`} to="/provider/surplus">
                    <i className="bi bi-box-seam me-1"></i> My Surplus
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/provider/matches')}`} to="/provider/matches">
                    <i className="bi bi-cpu-fill text-primary me-1"></i> Smart Matches
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/provider/history')}`} to="/provider/history">
                    <i className="bi bi-clock-history me-1"></i> History
                  </Link>
                </li>
              </>
            )}

            {user?.role === 'ROLE_RECIPIENT' && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/recipient/dashboard')}`} to="/recipient/dashboard">
                    <i className="bi bi-grid-1x2-fill me-1"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/recipient/requests')}`} to="/recipient/requests">
                    <i className="bi bi-clipboard2-check me-1"></i> Requirements
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/recipient/matches')}`} to="/recipient/matches">
                    <i className="bi bi-cpu-fill text-primary me-1"></i> Available Matches
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/recipient/tracking')}`} to="/recipient/tracking">
                    <i className="bi bi-truck me-1"></i> Live Tracking
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/recipient/history')}`} to="/recipient/history">
                    <i className="bi bi-clock-history me-1"></i> History
                  </Link>
                </li>
              </>
            )}

            {user?.role === 'ROLE_ADMIN' && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/admin/dashboard')}`} to="/admin/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i> Admin Console
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/admin/verifications')}`} to="/admin/verifications">
                    <i className="bi bi-shield-check me-1"></i> Verifications
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/admin/users')}`} to="/admin/users">
                    <i className="bi bi-people me-1"></i> Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/admin/resources')}`} to="/admin/resources">
                    <i className="bi bi-boxes me-1"></i> Resources
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/admin/requests')}`} to="/admin/requests">
                    <i className="bi bi-card-checklist me-1"></i> Requests
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/admin/analytics')}`} to="/admin/analytics">
                    <i className="bi bi-graph-up-arrow me-1"></i> Analytics
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Right Action Menu */}
          <div className="d-flex align-items-center gap-2">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline-custom">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary-custom shadow-sm">
                  Get Started <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </>
            ) : (
              <>
                {/* Role Specific Action Quick Button */}
                {user.role === 'ROLE_PROVIDER' && (
                  <Link to="/provider/surplus/new" className="btn btn-sm btn-primary-custom d-none d-md-flex align-items-center gap-1">
                    <i className="bi bi-plus-circle"></i> Add Surplus
                  </Link>
                )}
                {user.role === 'ROLE_RECIPIENT' && (
                  <Link to="/recipient/request/new" className="btn btn-sm btn-primary-custom d-none d-md-flex align-items-center gap-1">
                    <i className="bi bi-plus-circle"></i> New Requirement
                  </Link>
                )}

                {/* Notifications Bell */}
                <div className="dropdown position-relative">
                  <button
                    className="btn btn-light rounded-circle position-relative border"
                    style={{ width: '42px', height: '42px' }}
                    onClick={() => setShowNotifs(!showNotifs)}
                  >
                    <i className="bi bi-bell-fill text-secondary"></i>
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifs && (
                    <div className="card shadow-lg position-absolute end-0 mt-2 border-subtle rounded-xl p-0"
                         style={{ width: '340px', zIndex: 1050 }}>
                      <div className="card-header bg-white py-2 px-3 d-flex justify-content-between align-items-center border-bottom">
                        <span className="fw-bold text-dark fs-6">Notifications</span>
                        {unreadCount > 0 && (
                          <button className="btn btn-link btn-sm text-decoration-none p-0 text-success" onClick={handleMarkAllRead}>
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="list-group list-group-flush" style={{ maxHeight: '360px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                          <div className="p-3 text-center text-muted small">No new notifications</div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              className={`list-group-item list-group-item-action p-3 ${!n.readStatus ? 'bg-light' : ''}`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleMarkRead(n.id, n.linkUrl)}
                            >
                              <div className="d-flex w-100 justify-content-between align-items-center">
                                <h6 className="mb-1 fw-bold text-dark fs-7">{n.title}</h6>
                                {!n.readStatus && <span className="badge bg-success rounded-pill" style={{ width: '8px', height: '8px', padding: 0 }}> </span>}
                              </div>
                              <p className="mb-1 text-secondary small">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="dropdown ms-1">
                  <button
                    className="btn btn-light border d-flex align-items-center gap-2 rounded-pill px-3 py-1"
                    data-bs-toggle="dropdown"
                  >
                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                         style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}>
                      {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                    </div>
                    <div className="text-start d-none d-md-block">
                      <div className="fw-bold text-dark small leading-none">{user.fullName || user.email}</div>
                      <div className="text-muted" style={{ fontSize: '0.68rem' }}>
                        {user.role === 'ROLE_PROVIDER' ? 'Provider' :
                         user.role === 'ROLE_RECIPIENT' ? 'Recipient' : 'Administrator'}
                      </div>
                    </div>
                    <i className="bi bi-chevron-down text-muted small"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-sm border-subtle mt-1 rounded-xl">
                    <li className="px-3 py-2 border-bottom">
                      <div className="fw-bold text-dark">{user.organizationName || user.fullName}</div>
                      <div className="text-muted small">{user.email}</div>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2" to="/profile">
                        <i className="bi bi-person me-2 text-primary"></i> Organization Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2" to="/settings">
                        <i className="bi bi-gear me-2 text-secondary"></i> System Settings
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item py-2 text-danger" onClick={logout}>
                        <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

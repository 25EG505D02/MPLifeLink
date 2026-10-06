import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGetAdminAnalytics } from '../api/client';
import MetricCard from '../components/MetricCard';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await apiGetAdminAnalytics();
      setAnalytics(data);
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-dark text-white rounded-pill px-2.5 py-1 mb-1">
            <i className="bi bi-shield-lock-fill me-1"></i> CENTRAL GOVERNANCE
          </span>
          <h2 className="fw-extrabold text-dark mb-1">System Administration Console</h2>
          <p className="text-secondary small mb-0">
            Real-time oversight of community redistributions, organization audits, and algorithmic health.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/verifications" className="btn btn-warning text-dark fw-bold btn-sm shadow-sm">
            <i className="bi bi-shield-check me-1"></i> Verifications ({analytics?.pendingVerifications || 0})
          </Link>
          <Link to="/admin/analytics" className="btn btn-primary-custom btn-sm shadow-sm">
            <i className="bi bi-graph-up me-1"></i> Impact Analytics
          </Link>
          <Link to="/admin/users" className="btn btn-light border btn-sm">
            <i className="bi bi-people me-1"></i> Manage Users
          </Link>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="row g-3 mb-4">
        <div className="col-lg-2 col-md-4 col-6">
          <MetricCard
            title="Total Providers"
            value={analytics?.totalProviders || 5}
            subtitle="Registered donors"
            icon="bi-building"
            iconBg="bg-success-subtle text-success"
          />
        </div>
        <div className="col-lg-2 col-md-4 col-6">
          <MetricCard
            title="Recipient Orgs"
            value={analytics?.totalRecipients || 5}
            subtitle="Verified shelters"
            icon="bi-heart-pulse"
            iconBg="bg-primary-subtle text-primary"
          />
        </div>
        <div className="col-lg-2 col-md-4 col-6">
          <MetricCard
            title="Active Surplus"
            value={analytics?.activeResources || 12}
            subtitle="Available listings"
            icon="bi-box-seam"
            iconBg="bg-info-subtle text-info"
          />
        </div>
        <div className="col-lg-2 col-md-4 col-6">
          <MetricCard
            title="Active Demands"
            value={analytics?.activeRequests || 10}
            subtitle="Open requirements"
            icon="bi-clipboard2-check"
            iconBg="bg-warning-subtle text-warning"
          />
        </div>
        <div className="col-lg-2 col-md-4 col-6">
          <MetricCard
            title="Completed Rescues"
            value={analytics?.totalRedistributions || 3}
            subtitle="Fulfilled shipments"
            icon="bi-truck"
            iconBg="bg-teal-subtle text-teal"
          />
        </div>
        <div className="col-lg-2 col-md-4 col-6">
          <MetricCard
            title="Kg Rescued"
            value={`${analytics?.totalKgRescued || 3450} kg`}
            subtitle="Landfill diversion"
            icon="bi-recycle"
            iconBg="bg-danger-subtle text-danger"
          />
        </div>
      </div>

      {/* Verification Queue Prompt */}
      {analytics?.pendingVerifications > 0 && (
        <div className="alert alert-warning border-warning rounded-xl p-3 mb-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-shield-exclamation fs-4 text-warning-emphasis"></i>
              <div>
                <strong className="text-dark">{analytics.pendingVerifications} Organization(s) Awaiting Credential Verification</strong>
                <div className="text-secondary small">Review license numbers and approve NGO credentials for system participation.</div>
              </div>
            </div>
            <Link to="/admin/verifications" className="btn btn-sm btn-dark px-3">
              Review Queue <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      )}

      {/* Category & Priority Breakdowns */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card shadow-soft border-subtle rounded-xl p-4 bg-white h-100">
            <h5 className="fw-bold text-dark mb-3">Resource Distribution by Category</h5>
            {analytics?.categoryDistribution ? (
              <div className="d-flex flex-column gap-3">
                {Object.entries(analytics.categoryDistribution).map(([cat, count]) => (
                  <div key={cat}>
                    <div className="d-flex justify-content-between small fw-semibold mb-1">
                      <span className="text-dark">{cat.replace(/_/g, ' ')}</span>
                      <span className="text-secondary">{count} listings</span>
                    </div>
                    <div className="progress" style={{ height: '7px' }}>
                      <div className="progress-bar bg-success" style={{ width: `${Math.min(100, count * 20)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted small">Loading category data...</div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-soft border-subtle rounded-xl p-4 bg-white h-100">
            <h5 className="fw-bold text-dark mb-3">Requirement Demands by Priority</h5>
            {analytics?.priorityDistribution ? (
              <div className="d-flex flex-column gap-3">
                {Object.entries(analytics.priorityDistribution).map(([prio, count]) => {
                  let color = 'bg-secondary';
                  if (prio === 'CRITICAL') color = 'bg-danger';
                  if (prio === 'HIGH') color = 'bg-warning';
                  if (prio === 'MEDIUM') color = 'bg-info';
                  return (
                    <div key={prio}>
                      <div className="d-flex justify-content-between small fw-semibold mb-1">
                        <span className="text-dark">{prio} Urgency</span>
                        <span className="text-secondary">{count} requests</span>
                      </div>
                      <div className="progress" style={{ height: '7px' }}>
                        <div className={`progress-bar ${color}`} style={{ width: `${Math.min(100, count * 20)}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-muted small">Loading priority data...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

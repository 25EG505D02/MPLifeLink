import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGetMyRequests, apiGetRecipientMatches, apiGetMyDeliveries } from '../api/client';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';

export default function RecipientDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [matches, setMatches] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqList, matchList, delList] = await Promise.all([
        apiGetMyRequests().catch(() => []),
        apiGetRecipientMatches().catch(() => []),
        apiGetMyDeliveries().catch(() => []),
      ]);
      setRequests(reqList);
      setMatches(matchList);
      setDeliveries(delList);
    } finally {
      setLoading(false);
    }
  };

  const activeRequests = requests.filter(r => r.status === 'OPEN').length;
  const inTransitDeliveries = deliveries.filter(d => d.status === 'IN_TRANSIT' || d.status === 'APPROVED' || d.status === 'PICKUP_SCHEDULED').length;
  const completedCount = deliveries.filter(d => d.status === 'RECEIVED').length;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1">
              RECIPIENT PORTAL
            </span>
            {user?.verified && (
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                <i className="bi bi-patch-check-fill me-1"></i> Verified Organization
              </span>
            )}
          </div>
          <h2 className="fw-extrabold text-dark mb-1">
            {user?.organizationName || 'Recipient Dashboard'}
          </h2>
          <p className="text-secondary small mb-0">
            Post community needs, review prioritized surplus matches, and monitor live deliveries.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Link to="/recipient/request/new" className="btn btn-primary-custom shadow-sm d-flex align-items-center gap-1.5">
            <i className="bi bi-plus-circle"></i> New Requirement
          </Link>
          <Link to="/recipient/matches" className="btn btn-outline-custom d-flex align-items-center gap-1.5">
            <i className="bi bi-cpu"></i> Available Matches ({matches.length})
          </Link>
          <Link to="/recipient/tracking" className="btn btn-light border d-flex align-items-center gap-1.5">
            <i className="bi bi-truck text-primary"></i> Live Tracking ({inTransitDeliveries})
          </Link>
          <Link to="/recipient/history" className="btn btn-light border d-flex align-items-center gap-1.5">
            <i className="bi bi-clock-history"></i> History
          </Link>
        </div>
      </div>

      {/* In-Transit Alert Banner if active delivery exists */}
      {inTransitDeliveries > 0 && (
        <div className="alert alert-info border-info rounded-xl p-3 mb-4 shadow-sm bg-info-subtle">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-truck fs-3 text-info-emphasis"></i>
              <div>
                <strong className="text-dark">Active Delivery in Progress!</strong>
                <div className="text-secondary small">
                  A food surplus redistribution is currently scheduled or en route to your location.
                </div>
              </div>
            </div>
            <Link to="/recipient/tracking" className="btn btn-sm btn-primary px-3">
              Open Tracking Stepper <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <MetricCard
            title="Active Requirements"
            value={activeRequests}
            subtitle="Broadcast to engine"
            icon="bi-clipboard2-check"
            iconBg="bg-primary-subtle text-primary"
          />
        </div>
        <div className="col-md-3 col-6">
          <MetricCard
            title="Matching Surplus"
            value={matches.length}
            subtitle="Nearby resources"
            icon="bi-box2-heart"
            iconBg="bg-success-subtle text-success"
            badgeText="Ready to Claim"
          />
        </div>
        <div className="col-md-3 col-6">
          <MetricCard
            title="Incoming Deliveries"
            value={inTransitDeliveries}
            subtitle="Active transport"
            icon="bi-truck"
            iconBg="bg-info-subtle text-info"
          />
        </div>
        <div className="col-md-3 col-6">
          <MetricCard
            title="Received Shipments"
            value={completedCount}
            subtitle="Confirmed deliveries"
            icon="bi-patch-check-fill"
            iconBg="bg-warning-subtle text-warning"
          />
        </div>
      </div>

      {/* Active Requirements List */}
      <div className="card shadow-soft border-subtle rounded-xl overflow-hidden mb-4 bg-white">
        <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
          <h5 className="fw-bold text-dark mb-0">Active Organization Demands</h5>
          <Link to="/recipient/requests" className="btn btn-sm btn-outline-custom">
            Manage All <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-secondary">
              <tr>
                <th className="ps-4">Requirement Title</th>
                <th>Category</th>
                <th>Quantity Needed</th>
                <th>Priority</th>
                <th>Required By</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No requirements submitted yet. Click "New Requirement" to request food aid.
                  </td>
                </tr>
              ) : (
                requests.slice(0, 5).map((req) => (
                  <tr key={req.id}>
                    <td className="ps-4">
                      <div className="fw-bold text-dark">{req.title}</div>
                      <div className="text-muted small">Req ID: #{req.id}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {req.resourceCategory?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="fw-bold text-dark">
                      {req.quantityNeeded} {req.unit}
                    </td>
                    <td>
                      <StatusBadge status={req.priority} />
                    </td>
                    <td className="small text-secondary">
                      {new Date(req.requiredBy).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(req.requiredBy).toLocaleDateString()}
                    </td>
                    <td>
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="text-end pe-4">
                      <Link to="/recipient/matches" className="btn btn-sm btn-outline-primary">
                        Find Surplus
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGetMyResources, apiGetProviderMatches, apiGetExpiringSoon } from '../api/client';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [matches, setMatches] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [resList, matchList, expList] = await Promise.all([
        apiGetMyResources().catch(() => []),
        apiGetProviderMatches().catch(() => []),
        apiGetExpiringSoon().catch(() => []),
      ]);
      setResources(resList);
      setMatches(matchList);
      setExpiring(expList);
    } finally {
      setLoading(false);
    }
  };

  const activeCount = resources.filter(r => r.status === 'AVAILABLE').length;
  const matchedCount = matches.filter(m => m.status === 'ACCEPTED').length;
  const completedCount = resources.filter(r => r.status === 'COMPLETED').length;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1">
              PROVIDER PORTAL
            </span>
            {user?.verified && (
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">
                <i className="bi bi-patch-check-fill me-1"></i> Verified Partner
              </span>
            )}
          </div>
          <h2 className="fw-extrabold text-dark mb-1">
            {user?.organizationName || 'Provider Dashboard'}
          </h2>
          <p className="text-secondary small mb-0">
            Monitor surplus inventory, algorithmically ranked recipients, and active distribution progress.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="d-flex flex-wrap gap-2">
          <Link to="/provider/surplus/new" className="btn btn-primary-custom shadow-sm d-flex align-items-center gap-1.5">
            <i className="bi bi-plus-circle"></i> Add Surplus
          </Link>
          <Link to="/provider/matches" className="btn btn-outline-custom d-flex align-items-center gap-1.5">
            <i className="bi bi-cpu"></i> View Matches ({matches.length})
          </Link>
          <Link to="/provider/history" className="btn btn-light border d-flex align-items-center gap-1.5">
            <i className="bi bi-clock-history"></i> History
          </Link>
          <Link to="/profile" className="btn btn-light border d-flex align-items-center gap-1.5">
            <i className="bi bi-person"></i> Profile
          </Link>
        </div>
      </div>

      {/* Expiring Resources Urgency Alert */}
      {expiring.length > 0 && (
        <div className="alert alert-warning border-warning rounded-xl p-3 mb-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-hourglass-bottom fs-4 text-warning-emphasis"></i>
              <div>
                <strong className="text-dark">Urgent: {expiring.length} item(s) approaching expiry in &lt; 6 hours!</strong>
                <div className="text-secondary small">
                  The matching engine has boosted recipient matching scores to prioritize immediate pickup.
                </div>
              </div>
            </div>
            <Link to="/provider/matches" className="btn btn-sm btn-warning text-dark fw-bold px-3">
              Review Priority Matches <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <MetricCard
            title="Active Surplus Listings"
            value={activeCount}
            subtitle="Ready for matching"
            icon="bi-box-seam"
            iconBg="bg-success-subtle text-success"
          />
        </div>
        <div className="col-md-3 col-6">
          <MetricCard
            title="Ranked Matches Found"
            value={matches.length}
            subtitle="High score recipients"
            icon="bi-cpu-fill"
            iconBg="bg-primary-subtle text-primary"
            badgeText="AI Engine"
          />
        </div>
        <div className="col-md-3 col-6">
          <MetricCard
            title="Approved Distributions"
            value={matchedCount}
            subtitle="In logistics / transit"
            icon="bi-truck"
            iconBg="bg-info-subtle text-info"
          />
        </div>
        <div className="col-md-3 col-6">
          <MetricCard
            title="Completed Rescues"
            value={completedCount}
            subtitle="Successfully verified"
            icon="bi-patch-check-fill"
            iconBg="bg-warning-subtle text-warning"
          />
        </div>
      </div>

      {/* Real-World Demo Scenario Callout if Campus Cafeteria */}
      {user?.email?.includes('cafeteria') && (
        <div className="card shadow-soft border-primary border-2 rounded-xl p-3 mb-4 bg-primary-subtle bg-opacity-25">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <span className="badge bg-primary text-white rounded-pill px-2.5 py-1 mb-1 fw-bold">
                UNIVERSITY DEMO SCENARIO
              </span>
              <h5 className="fw-bold text-dark mb-1">Campus Cafeteria: 50 Portions Prepared Meals</h5>
              <p className="text-secondary small mb-0">
                The Matching Engine has evaluated recipient requests from Hope Shelter (30u, 1.5km), City Food Relief (40u, 6.8km), and Youth Care (20u, 3.2km).
              </p>
            </div>
            <Link to="/provider/matches" className="btn btn-primary-custom shadow-sm px-4">
              Explore Engine Ranking <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      )}

      {/* Active Surplus Inventory Table */}
      <div className="card shadow-soft border-subtle rounded-xl overflow-hidden mb-4">
        <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
          <h5 className="fw-bold text-dark mb-0">Current Surplus Inventory</h5>
          <Link to="/provider/surplus" className="btn btn-sm btn-outline-custom">
            Manage All <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-secondary">
              <tr>
                <th className="ps-4">Resource</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Pickup Location</th>
                <th>Expires</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No surplus resources posted yet. Click "Add Surplus" to publish your first listing.
                  </td>
                </tr>
              ) : (
                resources.slice(0, 5).map((res) => (
                  <tr key={res.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-2">
                        {res.imageUrl ? (
                          <img src={res.imageUrl} alt="" className="rounded-3" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                        ) : (
                          <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                            <i className="bi bi-box-seam text-muted"></i>
                          </div>
                        )}
                        <div>
                          <div className="fw-bold text-dark">{res.title}</div>
                          <div className="text-muted small">ID: #{res.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {res.category?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="fw-bold text-dark">
                      {res.quantity} {res.unit}
                    </td>
                    <td className="small text-secondary text-truncate" style={{ maxWidth: '180px' }}>
                      {res.pickupLocation}
                    </td>
                    <td className="small text-secondary">
                      {new Date(res.expiryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                        {new Date(res.expiryDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={res.status} />
                    </td>
                    <td className="text-end pe-4">
                      <Link to="/provider/matches" className="btn btn-sm btn-outline-success">
                        Matches
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGetMyRequests, apiCancelRequest } from '../api/client';
import StatusBadge from '../components/StatusBadge';

export default function RequirementsListPage() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await apiGetMyRequests();
      setRequests(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this demand requirement?')) {
      try {
        await apiCancelRequest(id);
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r));
      } catch (e) {
        alert(e.message);
      }
    }
  };

  const filtered = requests.filter(r => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1 mb-1">
            DEMAND PIPELINE
          </span>
          <h2 className="fw-extrabold text-dark mb-1">Organization Requirements</h2>
          <p className="text-secondary small mb-0">
            Active food requests prioritized by the matching engine for incoming surplus allocations.
          </p>
        </div>

        <Link to="/recipient/request/new" className="btn btn-primary-custom shadow-sm d-flex align-items-center gap-1.5">
          <i className="bi bi-plus-circle"></i> New Requirement
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4 border-bottom pb-3">
        {['ALL', 'OPEN', 'MATCHED', 'FULFILLED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${filter === tab ? 'btn-primary text-white' : 'btn-light text-secondary border'}`}
            onClick={() => setFilter(tab)}
          >
            {tab === 'ALL' ? 'All Demands' : tab}
            {tab !== 'ALL' && (
              <span className="ms-1.5 badge bg-white text-dark rounded-pill" style={{ fontSize: '0.7rem' }}>
                {requests.filter(r => r.status === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card shadow-soft border-subtle rounded-xl p-5 text-center bg-white">
          <i className="bi bi-clipboard2-x text-muted display-4 mb-3"></i>
          <h5 className="fw-bold text-dark mb-1">No requirements found</h5>
          <p className="text-muted small mb-3">Post a community requirement to receive matching notifications.</p>
          <div>
            <Link to="/recipient/request/new" className="btn btn-primary-custom btn-sm">
              Create Requirement
            </Link>
          </div>
        </div>
      ) : (
        <div className="card shadow-soft border-subtle rounded-xl overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-secondary">
                <tr>
                  <th className="ps-4">Requirement</th>
                  <th>Category</th>
                  <th>Needed Quantity</th>
                  <th>Priority Weight</th>
                  <th>Required By</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req) => (
                  <tr key={req.id}>
                    <td className="ps-4">
                      <div className="fw-bold text-dark">{req.title}</div>
                      <div className="text-muted small text-truncate" style={{ maxWidth: '250px' }}>
                        {req.deliveryLocation}
                      </div>
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
                      {req.status === 'OPEN' ? (
                        <div className="d-flex justify-content-end gap-1">
                          <Link to="/recipient/matches" className="btn btn-sm btn-primary">
                            <i className="bi bi-cpu me-1"></i> Matches
                          </Link>
                          <button
                            className="btn btn-sm btn-light border text-danger"
                            onClick={() => handleCancel(req.id)}
                            title="Cancel Request"
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                      ) : (
                        <Link to="/recipient/tracking" className="btn btn-sm btn-outline-info">
                          Track Status
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

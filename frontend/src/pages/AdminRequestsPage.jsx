import React, { useState, useEffect } from 'react';
import { apiGetAdminRequests, apiCancelRequest } from '../api/client';
import StatusBadge from '../components/StatusBadge';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [prioFilter, setPrioFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await apiGetAdminRequests();
      setRequests(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm(`Are you sure you want to cancel requirement #${id}?`)) {
      try {
        await apiCancelRequest(id);
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r));
      } catch (e) {
        alert(e.message);
      }
    }
  };

  const filtered = requests.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                        (r.organizationName && r.organizationName.toLowerCase().includes(search.toLowerCase())) ||
                        r.deliveryLocation.toLowerCase().includes(search.toLowerCase());
    const matchPrio = prioFilter === 'ALL' || r.priority === prioFilter;
    return matchSearch && matchPrio;
  });

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-dark text-white rounded-pill px-2.5 py-1 mb-1">
            DEMAND REGISTRY
          </span>
          <h2 className="fw-extrabold text-dark mb-1">Master Community Requests</h2>
          <p className="text-secondary small mb-0">
            Monitor incoming relief requests across all verified shelters, soup kitchens, and charities.
          </p>
        </div>

        <button className="btn btn-outline-secondary btn-sm" onClick={loadRequests}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Requests
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="card shadow-soft border-subtle rounded-xl p-3 mb-4 bg-white">
        <div className="row g-3">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by request title, recipient shelter, or delivery location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={prioFilter}
              onChange={(e) => setPrioFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Master Requests Table */}
      <div className="card shadow-soft border-subtle rounded-xl overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-secondary">
              <tr>
                <th className="ps-4">Request ID & Title</th>
                <th>Recipient Shelter</th>
                <th>Category</th>
                <th>Quantity Needed</th>
                <th>Priority</th>
                <th>Delivery Destination</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => (
                <tr key={req.id}>
                  <td className="ps-4">
                    <div className="fw-bold text-dark">{req.title}</div>
                    <div className="text-muted small">REF-REQ-{req.id}</div>
                  </td>
                  <td>
                    <div className="fw-semibold text-dark">{req.organizationName || req.recipientName}</div>
                    <span className="badge bg-light text-muted border small">Recipient NGO</span>
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
                  <td className="small text-secondary text-truncate" style={{ maxWidth: '180px' }}>
                    {req.deliveryLocation}
                  </td>
                  <td>
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="text-end pe-4">
                    {req.status === 'OPEN' && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleCancel(req.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

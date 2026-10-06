import React, { useState, useEffect } from 'react';
import { apiGetAdminResources, apiDeleteResource } from '../api/client';
import StatusBadge from '../components/StatusBadge';

export default function AdminResourcesPage() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await apiGetAdminResources();
      setResources(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to remove resource listing #${id}?`)) {
      try {
        await apiDeleteResource(id);
        setResources(prev => prev.filter(r => r.id !== id));
      } catch (e) {
        alert(e.message);
      }
    }
  };

  const filtered = resources.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                        (r.organizationName && r.organizationName.toLowerCase().includes(search.toLowerCase())) ||
                        r.pickupLocation.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'ALL' || r.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-dark text-white rounded-pill px-2.5 py-1 mb-1">
            REGULATORY SURVEILLANCE
          </span>
          <h2 className="fw-extrabold text-dark mb-1">Master Resource Directory</h2>
          <p className="text-secondary small mb-0">
            Audit surplus listings across all commercial providers, verify food safety windows, and handle invalid records.
          </p>
        </div>

        <button className="btn btn-outline-secondary btn-sm" onClick={loadResources}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Listings
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
                placeholder="Search by resource title, provider organization, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="COOKED_MEALS">Cooked Meals</option>
              <option value="FRESH_PRODUCE">Fresh Produce</option>
              <option value="BAKERY">Bakery</option>
              <option value="DAIRY">Dairy</option>
              <option value="PACKAGED_GOODS">Packaged Goods</option>
              <option value="BEVERAGES">Beverages</option>
            </select>
          </div>
        </div>
      </div>

      {/* Master Resources Table */}
      <div className="card shadow-soft border-subtle rounded-xl overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-secondary">
              <tr>
                <th className="ps-4">Resource ID & Title</th>
                <th>Provider Entity</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Pickup Location</th>
                <th>Expiry</th>
                <th>Status</th>
                <th className="text-end pe-4">Intervention</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((res) => (
                <tr key={res.id}>
                  <td className="ps-4">
                    <div className="fw-bold text-dark">{res.title}</div>
                    <div className="text-muted small">REF-RES-{res.id}</div>
                  </td>
                  <td>
                    <div className="fw-semibold text-dark">{res.organizationName || res.providerName}</div>
                    <span className="badge bg-light text-muted border small">Commercial Provider</span>
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
                  <td className="small text-danger">
                    {new Date(res.expiryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                      {new Date(res.expiryDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={res.status} />
                  </td>
                  <td className="text-end pe-4">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(res.id)}
                      title="Flag or remove suspicious record"
                    >
                      <i className="bi bi-trash"></i> Remove
                    </button>
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

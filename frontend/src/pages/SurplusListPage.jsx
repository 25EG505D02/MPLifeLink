import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGetMyResources, apiDeleteResource } from '../api/client';
import StatusBadge from '../components/StatusBadge';

export default function SurplusListPage() {
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await apiGetMyResources();
      setResources(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this surplus listing?')) {
      try {
        await apiDeleteResource(id);
        setResources(prev => prev.filter(r => r.id !== id));
      } catch (e) {
        alert(e.message);
      }
    }
  };

  const filtered = resources.filter(r => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 mb-1">
            SURPLUS INVENTORY
          </span>
          <h2 className="fw-extrabold text-dark mb-1">My Surplus Listings</h2>
          <p className="text-secondary small mb-0">
            Track published surplus, status transitions, and evaluate matched recipients.
          </p>
        </div>

        <Link to="/provider/surplus/new" className="btn btn-primary-custom shadow-sm d-flex align-items-center gap-1.5">
          <i className="bi bi-plus-circle"></i> Add New Surplus
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4 border-bottom pb-3">
        {['ALL', 'AVAILABLE', 'MATCHED', 'COLLECTED', 'COMPLETED', 'EXPIRED'].map((tab) => (
          <button
            key={tab}
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${filter === tab ? 'btn-success text-white' : 'btn-light text-secondary border'}`}
            onClick={() => setFilter(tab)}
          >
            {tab === 'ALL' ? 'All Listings' : tab.replace(/_/g, ' ')}
            {tab !== 'ALL' && (
              <span className="ms-1.5 badge bg-white text-dark rounded-pill" style={{ fontSize: '0.7rem' }}>
                {resources.filter(r => r.status === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      {filtered.length === 0 ? (
        <div className="card shadow-soft border-subtle rounded-xl p-5 text-center bg-white">
          <i className="bi bi-inbox text-muted display-4 mb-3"></i>
          <h5 className="fw-bold text-dark mb-1">No listings found for this filter</h5>
          <p className="text-muted small mb-3">Add a new surplus item to make resources available for community redistribution.</p>
          <div>
            <Link to="/provider/surplus/new" className="btn btn-primary-custom btn-sm">
              Post Surplus
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map((item) => (
            <div key={item.id} className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-soft border-subtle rounded-xl overflow-hidden bg-white">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt="" className="resource-card-img" />
                )}
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill small">
                        {item.category?.replace(/_/g, ' ')}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>

                    <h5 className="fw-bold text-dark mb-1">{item.title}</h5>
                    <p className="text-secondary small mb-3" style={{ minHeight: '38px' }}>
                      {item.description || 'No additional notes provided.'}
                    </p>

                    <div className="bg-light rounded-3 p-3 mb-3 border">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small">Quantity:</span>
                        <strong className="text-dark fs-6">{item.quantity} {item.unit}</strong>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small">Location:</span>
                        <span className="text-dark small text-truncate" style={{ maxWidth: '160px' }}>
                          {item.pickupLocation}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted small">Expiry Window:</span>
                        <span className="text-danger small fw-semibold">
                          {new Date(item.expiryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(item.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <Link to="/provider/matches" className="btn btn-sm btn-primary-custom">
                      <i className="bi bi-cpu me-1"></i> Matches
                    </Link>
                    <button
                      className="btn btn-sm btn-light border text-danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

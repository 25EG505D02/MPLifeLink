import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiCreateRequest } from '../api/client';

export default function NewRequirementPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const defaultRequiredBy = new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    title: '',
    resourceCategory: 'COOKED_MEALS',
    quantityNeeded: 30,
    unit: 'PORTIONS',
    priority: 'HIGH',
    requiredBy: defaultRequiredBy,
    deliveryLocation: 'Hope Community Shelter, 14 Peace Way, Central Ward',
    latitude: 12.9800,
    longitude: 77.6000,
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiCreateRequest({
        ...formData,
        quantityNeeded: parseFloat(formData.quantityNeeded),
      });
      navigate('/recipient/requests');
    } catch (err) {
      setError(err.message || 'Failed to submit requirement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="d-flex align-items-center gap-2 mb-3">
            <Link to="/recipient/requests" className="text-secondary text-decoration-none small">
              <i className="bi bi-arrow-left"></i> Back to Requirements
            </Link>
          </div>

          <div className="card shadow-soft border-subtle rounded-xl p-4 p-md-5 bg-white">
            <div className="mb-4">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1 mb-2">
                COMMUNITY DEMAND INTAKE
              </span>
              <h3 className="fw-extrabold text-dark mb-1">Create Resource Requirement</h3>
              <p className="text-secondary small mb-0">
                Broadcast your community's resource needs. The Matching Engine evaluates priorities and automatically scores incoming surplus.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small rounded-3 d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">Requirement Title / Purpose</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="e.g. Hot Meals for Afternoon Shelter Lunch Program"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Resource Category</label>
                  <select
                    name="resourceCategory"
                    className="form-select"
                    value={formData.resourceCategory}
                    onChange={handleChange}
                  >
                    <option value="COOKED_MEALS">Cooked Meals / Prepared Food</option>
                    <option value="FRESH_PRODUCE">Fresh Produce / Fruits & Vegetables</option>
                    <option value="BAKERY">Bakery & Bread</option>
                    <option value="DAIRY">Dairy & Milk Products</option>
                    <option value="PACKAGED_GOODS">Packaged Dry Goods</option>
                    <option value="BEVERAGES">Beverages & Juices</option>
                    <option value="OTHER">Other Goods</option>
                  </select>
                </div>

                <div className="col-md-3 col-6">
                  <label className="form-label small fw-semibold text-secondary">Quantity Needed</label>
                  <input
                    type="number"
                    name="quantityNeeded"
                    className="form-control"
                    placeholder="30"
                    value={formData.quantityNeeded}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </div>

                <div className="col-md-3 col-6">
                  <label className="form-label small fw-semibold text-secondary">Unit</label>
                  <select
                    name="unit"
                    className="form-select"
                    value={formData.unit}
                    onChange={handleChange}
                  >
                    <option value="PORTIONS">PORTIONS</option>
                    <option value="KG">KG (Kilograms)</option>
                    <option value="BOXES">BOXES</option>
                    <option value="LITERS">LITERS</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Request Urgency / Priority</label>
                  <select
                    name="priority"
                    className="form-select fw-bold text-dark"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="CRITICAL">🔴 CRITICAL (Emergency Shortage - 100% Boost)</option>
                    <option value="HIGH">🟡 HIGH (Urgent Community Demand - 80% Weight)</option>
                    <option value="MEDIUM">🔵 MEDIUM (Standard Program Requirement - 55% Weight)</option>
                    <option value="LOW">⚪ LOW (Flexible Stock Supplement - 30% Weight)</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Required By (Deadline)</label>
                  <input
                    type="datetime-local"
                    name="requiredBy"
                    className="form-control"
                    value={formData.requiredBy}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">Delivery / Drop-Off Destination</label>
                  <input
                    type="text"
                    name="deliveryLocation"
                    className="form-control"
                    placeholder="e.g. Hope Community Shelter Dining Wing, 14 Peace Way"
                    value={formData.deliveryLocation}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">Beneficiary Notes & Dietary Requirements</label>
                  <textarea
                    name="description"
                    rows="3"
                    className="form-control"
                    placeholder="e.g. Serves 30 sheltered families. Reheating capacity available on site. Safe unloading dock at front gate."
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <Link to="/recipient/requests" className="btn btn-light border px-4">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary-custom px-4 shadow-sm"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Register Requirement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

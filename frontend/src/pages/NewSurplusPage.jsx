import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiCreateResource } from '../api/client';

const PRESET_IMAGES = [
  { label: 'Prepared Meals', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
  { label: 'Fresh Produce', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80' },
  { label: 'Bakery & Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80' },
  { label: 'Dairy Cartons', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80' },
  { label: 'Fruit Juices', url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80' },
];

export default function NewSurplusPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default times: available from now, expiring in 4 hours
  const nowStr = new Date().toISOString().slice(0, 16);
  const defaultExpiry = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    title: '',
    category: 'COOKED_MEALS',
    quantity: 50,
    unit: 'PORTIONS',
    availableFrom: nowStr,
    availableUntil: defaultExpiry,
    expiryDate: defaultExpiry,
    pickupLocation: 'Campus Central Cafeteria Kitchen Bay, Gate 2',
    latitude: 12.9716,
    longitude: 77.5946,
    description: '',
    imageUrl: PRESET_IMAGES[0].url,
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
      await apiCreateResource({
        ...formData,
        quantity: parseFloat(formData.quantity),
      });
      navigate('/provider/surplus');
    } catch (err) {
      setError(err.message || 'Failed to create surplus listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="d-flex align-items-center gap-2 mb-3">
            <Link to="/provider/surplus" className="text-secondary text-decoration-none small">
              <i className="bi bi-arrow-left"></i> Back to Inventory
            </Link>
          </div>

          <div className="card shadow-soft border-subtle rounded-xl p-4 p-md-5 bg-white">
            <div className="mb-4">
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 mb-2">
                NEW SURPLUS LISTING
              </span>
              <h3 className="fw-extrabold text-dark mb-1">Post Surplus Resource</h3>
              <p className="text-secondary small mb-0">
                Enter surplus resource details. Once published, the Matching Engine will instantly score and prioritize nearby recipient shelters.
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
                  <label className="form-label small fw-semibold text-secondary">Resource Title / Description Name</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="e.g. Prepared Food – Fresh Biryani & Vegetable Curry Meal Boxes"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Resource Category</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="COOKED_MEALS">Cooked Meals / Prepared Food</option>
                    <option value="FRESH_PRODUCE">Fresh Produce / Fruits & Vegetables</option>
                    <option value="BAKERY">Bakery & Bread</option>
                    <option value="DAIRY">Dairy & Milk Products</option>
                    <option value="PACKAGED_GOODS">Packaged Dry Goods</option>
                    <option value="BEVERAGES">Beverages & Juices</option>
                    <option value="OTHER">Other Surplus</option>
                  </select>
                </div>

                <div className="col-md-3 col-6">
                  <label className="form-label small fw-semibold text-secondary">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    placeholder="50"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </div>

                <div className="col-md-3 col-6">
                  <label className="form-label small fw-semibold text-secondary">Unit of Measure</label>
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
                  <label className="form-label small fw-semibold text-secondary">Available From</label>
                  <input
                    type="datetime-local"
                    name="availableFrom"
                    className="form-control"
                    value={formData.availableFrom}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary text-danger">
                    <i className="bi bi-clock-history me-1"></i> Expiry / Use-By Date
                  </label>
                  <input
                    type="datetime-local"
                    name="expiryDate"
                    className="form-control border-warning"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text text-muted" style={{ fontSize: '0.75rem' }}>
                    Engine uses this to calculate urgency decay.
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">Pickup Location & Specific Gate</label>
                  <input
                    type="text"
                    name="pickupLocation"
                    className="form-control"
                    placeholder="e.g. Central Cafeteria Loading Bay, Gate 2, West Quad"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">Packaging & Handling Notes</label>
                  <textarea
                    name="description"
                    rows="3"
                    className="form-control"
                    placeholder="e.g. Freshly packed in clean individual containers. Hot temperature maintained. Ready for immediate vehicle pickup."
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Preset Visual Asset Picker */}
                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary d-block">
                    Select Resource Photo Visual Asset
                  </label>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {PRESET_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`btn btn-sm ${formData.imageUrl === img.url ? 'btn-success' : 'btn-light border'} rounded-pill`}
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: img.url }))}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img src={formData.imageUrl} alt="Preview" className="rounded-3 shadow-sm" style={{ width: '120px', height: '80px', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <Link to="/provider/surplus" className="btn btn-light border px-4">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary-custom px-4 shadow-sm"
                  disabled={loading}
                >
                  {loading ? 'Publishing...' : 'Publish to Engine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

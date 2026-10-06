import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('ROLE_PROVIDER');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    organizationName: '',
    providerType: 'RESTAURANT',
    organizationType: 'NGO',
    address: '',
    licenseOrRegNumber: '',
    capacityPeople: 50,
    latitude: 12.9716,
    longitude: 77.5946,
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      await register({
        ...formData,
        role: role,
      });
      setSuccessMsg('Account registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your entries.');
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container py-3">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            <div className="card shadow-lg border-0 rounded-xl p-4 p-md-5 bg-white">
              <div className="text-center mb-4">
                <Link to="/" className="text-decoration-none text-success fw-bold d-inline-flex align-items-center gap-1 mb-2">
                  <i className="bi bi-heart-pulse-fill text-danger"></i> LIFELINK
                </Link>
                <h3 className="fw-bold text-dark mb-1">Create Organization Account</h3>
                <p className="text-muted small">Join the intelligent food & resource redistribution network</p>

                {/* Role Switcher Pills */}
                <div className="btn-group w-100 mt-3 p-1 bg-light rounded-pill border" role="group">
                  <button
                    type="button"
                    className={`btn rounded-pill fw-bold py-2 ${role === 'ROLE_PROVIDER' ? 'btn-success text-white shadow-sm' : 'btn-light text-muted'}`}
                    onClick={() => setRole('ROLE_PROVIDER')}
                  >
                    <i className="bi bi-building me-1"></i> Resource Provider
                  </button>
                  <button
                    type="button"
                    className={`btn rounded-pill fw-bold py-2 ${role === 'ROLE_RECIPIENT' ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'}`}
                    onClick={() => setRole('ROLE_RECIPIENT')}
                  >
                    <i className="bi bi-heart-fill me-1"></i> Recipient NGO / Shelter
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small rounded-3 d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-exclamation-circle-fill"></i>
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="alert alert-success py-2 small rounded-3 d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="row g-3">
                  {/* Common Contact Details */}
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Contact Person Name</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      placeholder="e.g. Rajan Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Organization Official Name</label>
                    <input
                      type="text"
                      name="organizationName"
                      className="form-control"
                      placeholder={role === 'ROLE_PROVIDER' ? 'e.g. Green Leaf Bistro' : 'e.g. Hope City Shelter'}
                      value={formData.organizationName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Official Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="contact@org.org"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Contact Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      className="form-control"
                      placeholder="+91-98765-43210"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">Secure Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                  </div>

                  {/* Role-Specific Fields */}
                  {role === 'ROLE_PROVIDER' ? (
                    <>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-secondary">Provider Type</label>
                        <select
                          name="providerType"
                          className="form-select"
                          value={formData.providerType}
                          onChange={handleChange}
                        >
                          <option value="CAFETERIA">College / Corporate Cafeteria</option>
                          <option value="RESTAURANT">Restaurant / Eatery</option>
                          <option value="SUPERMARKET">Supermarket / Grocery Store</option>
                          <option value="BAKERY">Artisan Bakery</option>
                          <option value="EVENT_ORGANIZER">Event / Banquet Caterer</option>
                          <option value="OTHER">Other Enterprise</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-secondary">FSSAI / Food License No.</label>
                        <input
                          type="text"
                          name="licenseOrRegNumber"
                          className="form-control"
                          placeholder="FSSAI-123456789012"
                          value={formData.licenseOrRegNumber}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-secondary">Organization Type</label>
                        <select
                          name="organizationType"
                          className="form-select"
                          value={formData.organizationType}
                          onChange={handleChange}
                        >
                          <option value="SHELTER">Community Shelter</option>
                          <option value="NGO">Registered NGO / Non-Profit</option>
                          <option value="FOOD_BANK">Food Bank & Distribution Hub</option>
                          <option value="COMMUNITY_KITCHEN">Community Soup Kitchen</option>
                          <option value="ELDERLY_CARE">Elderly Care Home</option>
                          <option value="YOUTH_HOME">Youth Transition Home</option>
                          <option value="OTHER">Other Relief Org</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-secondary">Daily Beneficiary Capacity</label>
                        <input
                          type="number"
                          name="capacityPeople"
                          className="form-control"
                          placeholder="50"
                          value={formData.capacityPeople}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold text-secondary">NGO Registration / Trust ID</label>
                        <input
                          type="text"
                          name="licenseOrRegNumber"
                          className="form-control"
                          placeholder="NGO-REG-12345"
                          value={formData.licenseOrRegNumber}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">Facility / Pickup Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      placeholder="Street, District, City, Pincode"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-2.5 mt-4 shadow-sm"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </button>
              </form>

              <div className="text-center small text-muted mt-4">
                Already registered?{' '}
                <Link to="/login" className="text-success fw-bold text-decoration-none">
                  Sign in here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

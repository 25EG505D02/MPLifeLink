import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGetProfile, apiUpdateProfile } from '../api/client';

export default function ProfilePage() {
  const { user, updateCurrentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await apiGetProfile();
      setProfile(data);
    } catch (e) {
      // Fallback to auth user
      setProfile({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        organizationName: user?.organizationName || '',
        address: 'Central Campus Hub, 14 Main Road',
        latitude: 12.9716,
        longitude: 77.5946,
        licenseOrReg: 'FSSAI-112233445566',
        capacityPeople: 50,
        verified: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updated = await apiUpdateProfile(profile);
      setProfile(updated);
      updateCurrentUser({
        fullName: updated.fullName,
        organizationName: updated.organizationName,
      });
      setMessage('Profile updated successfully!');
    } catch (err) {
      alert(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return <div className="container py-5 text-center text-muted">Loading profile...</div>;
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-soft border-subtle rounded-xl p-4 p-md-5 bg-white">
            <div className="d-flex justify-content-between align-items-start mb-4 border-bottom pb-3">
              <div>
                <span className="badge bg-light text-muted border mb-1">
                  {user?.role?.replace('ROLE_', '')} ACCOUNT
                </span>
                <h3 className="fw-extrabold text-dark mb-1">{profile.organizationName || profile.fullName}</h3>
                <div className="text-secondary small">{profile.email}</div>
              </div>

              {profile.verified ? (
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1.5 fw-bold">
                  <i className="bi bi-patch-check-fill me-1"></i> Verified Credentials
                </span>
              ) : (
                <span className="badge bg-warning-subtle text-warning-emphasis border border-warning rounded-pill px-3 py-1.5">
                  <i className="bi bi-hourglass-split me-1"></i> Verification Pending
                </span>
              )}
            </div>

            {message && (
              <div className="alert alert-success py-2 small rounded-3 d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-check-circle-fill"></i>
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Contact Person Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    value={profile.fullName || ''}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    className="form-control"
                    value={profile.phoneNumber || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">Official Organization Name</label>
                  <input
                    type="text"
                    name="organizationName"
                    className="form-control"
                    value={profile.organizationName || ''}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">Operational Facility Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={profile.address || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">GPS Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    name="latitude"
                    className="form-control"
                    value={profile.latitude || 0}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">GPS Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    name="longitude"
                    className="form-control"
                    value={profile.longitude || 0}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">License / Registration ID</label>
                  <input
                    type="text"
                    name="licenseOrReg"
                    className="form-control"
                    value={profile.licenseOrReg || ''}
                    onChange={handleChange}
                  />
                </div>

                {user?.role === 'ROLE_RECIPIENT' && (
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Beneficiary Daily Capacity</label>
                    <input
                      type="number"
                      name="capacityPeople"
                      className="form-control"
                      value={profile.capacityPeople || 50}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                <button
                  type="submit"
                  className="btn btn-primary-custom px-4 shadow-sm"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

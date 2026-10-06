import React, { useState, useEffect } from 'react';
import { apiGetAdminVerifications, apiVerifyOrganization } from '../api/client';

export default function AdminVerificationsPage() {
  const [data, setData] = useState({ providers: [], recipients: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    setLoading(true);
    try {
      const res = await apiGetAdminVerifications();
      setData(res || { providers: [], recipients: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, type, approve) => {
    try {
      await apiVerifyOrganization(id, type, approve);
      setMessage(`Organization successfully ${approve ? 'verified and approved' : 'rejected'}. Notification dispatched.`);
      loadVerifications();
    } catch (e) {
      alert(e.message || 'Verification action failed');
    }
  };

  const totalPending = (data.providers?.length || 0) + (data.recipients?.length || 0);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="badge bg-warning text-dark rounded-pill px-2.5 py-1 mb-1 fw-bold">
            CREDENTIAL AUDIT
          </span>
          <h2 className="fw-extrabold text-dark mb-1">Organization Verifications</h2>
          <p className="text-secondary small mb-0">
            Verify food safety compliance, NGO charity registrations, and corporate provider credentials.
          </p>
        </div>

        <button className="btn btn-outline-secondary btn-sm" onClick={loadVerifications}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Queue
        </button>
      </div>

      {message && (
        <div className="alert alert-success border-success rounded-xl p-3 mb-4 shadow-sm d-flex align-items-center gap-2">
          <i className="bi bi-check-circle-fill text-success fs-5"></i>
          <div>{message}</div>
        </div>
      )}

      {totalPending === 0 ? (
        <div className="card shadow-soft border-subtle rounded-xl p-5 text-center bg-white mb-4">
          <i className="bi bi-shield-check text-success display-4 mb-3"></i>
          <h5 className="fw-bold text-dark mb-1">All organizations verified!</h5>
          <p className="text-muted small mb-0">
            There are currently no pending registration requests requiring administrative audit.
          </p>
        </div>
      ) : (
        <div className="row g-4 mb-4">
          {/* Pending Providers */}
          {data.providers && data.providers.length > 0 && (
            <div className="col-12">
              <div className="card shadow-soft border-subtle rounded-xl overflow-hidden bg-white">
                <div className="card-header bg-white py-3 px-4 border-bottom">
                  <h6 className="fw-bold text-dark mb-0">
                    <i className="bi bi-building me-2 text-success"></i> Pending Provider Applications ({data.providers.length})
                  </h6>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small text-secondary">
                      <tr>
                        <th className="ps-4">Organization</th>
                        <th>Type</th>
                        <th>License / FSSAI</th>
                        <th>Address</th>
                        <th className="text-end pe-4">Verification Audit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.providers.map((p) => (
                        <tr key={p.id}>
                          <td className="ps-4 fw-bold text-dark">{p.organizationName}</td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {p.providerType}
                            </span>
                          </td>
                          <td className="font-monospace small text-primary">{p.licenseNumber || 'Under Review'}</td>
                          <td className="small text-secondary">{p.address}</td>
                          <td className="text-end pe-4">
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleAction(p.id, 'PROVIDER', true)}
                            >
                              <i className="bi bi-check-lg me-1"></i> Approve
                            </button>
                            <button
                              className="btn btn-sm btn-light border text-danger"
                              onClick={() => handleAction(p.id, 'PROVIDER', false)}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Pending Recipients */}
          {data.recipients && data.recipients.length > 0 && (
            <div className="col-12">
              <div className="card shadow-soft border-subtle rounded-xl overflow-hidden bg-white">
                <div className="card-header bg-white py-3 px-4 border-bottom">
                  <h6 className="fw-bold text-dark mb-0">
                    <i className="bi bi-heart-fill me-2 text-primary"></i> Pending Recipient Applications ({data.recipients.length})
                  </h6>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small text-secondary">
                      <tr>
                        <th className="ps-4">Organization</th>
                        <th>Type</th>
                        <th>Registration / Trust ID</th>
                        <th>Capacity</th>
                        <th>Address</th>
                        <th className="text-end pe-4">Verification Audit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recipients.map((r) => (
                        <tr key={r.id}>
                          <td className="ps-4 fw-bold text-dark">{r.organizationName}</td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {r.organizationType}
                            </span>
                          </td>
                          <td className="font-monospace small text-primary">{r.registrationNumber || 'Pending Docs'}</td>
                          <td className="small text-dark fw-semibold">{r.capacityPeople} people</td>
                          <td className="small text-secondary">{r.address}</td>
                          <td className="text-end pe-4">
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleAction(r.id, 'RECIPIENT', true)}
                            >
                              <i className="bi bi-check-lg me-1"></i> Approve
                            </button>
                            <button
                              className="btn btn-sm btn-light border text-danger"
                              onClick={() => handleAction(r.id, 'RECIPIENT', false)}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

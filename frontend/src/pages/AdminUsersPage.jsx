import React, { useState, useEffect } from 'react';
import { apiGetAdminUsers, apiToggleUserStatus } from '../api/client';
import StatusBadge from '../components/StatusBadge';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await apiGetAdminUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const updated = await apiToggleUserStatus(userId, nextStatus);
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
    } catch (e) {
      alert(e.message || 'Failed to update user status');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="badge bg-dark text-white rounded-pill px-2.5 py-1 mb-1">
            ACCOUNT GOVERNANCE
          </span>
          <h2 className="fw-extrabold text-dark mb-1">Platform Users</h2>
          <p className="text-secondary small mb-0">
            View registered donors, community organizations, and administrative officers.
          </p>
        </div>

        <button className="btn btn-outline-secondary btn-sm" onClick={loadUsers}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      <div className="card shadow-soft border-subtle rounded-xl overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-secondary">
              <tr>
                <th className="ps-4">User</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Status</th>
                <th>Phone</th>
                <th>Joined</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center fw-bold text-dark border"
                           style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
                        {u.fullName ? u.fullName[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{u.fullName}</div>
                        <div className="text-muted small">UID: #{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="small text-secondary">{u.email}</td>
                  <td>
                    <span className={`badge rounded-pill px-2.5 py-1 fw-semibold small ${
                      u.role === 'ROLE_PROVIDER' ? 'bg-success-subtle text-success border border-success-subtle' :
                      u.role === 'ROLE_RECIPIENT' ? 'bg-primary-subtle text-primary border border-primary-subtle' :
                      'bg-dark text-white'
                    }`}>
                      {u.role === 'ROLE_PROVIDER' ? 'PROVIDER' :
                       u.role === 'ROLE_RECIPIENT' ? 'RECIPIENT' : 'ADMIN'}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="small text-muted">{u.phoneNumber || 'N/A'}</td>
                  <td className="small text-muted">
                    {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="text-end pe-4">
                    {u.role !== 'ROLE_ADMIN' && (
                      <button
                        className={`btn btn-sm ${u.status === 'ACTIVE' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        onClick={() => handleToggle(u.id, u.status)}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
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

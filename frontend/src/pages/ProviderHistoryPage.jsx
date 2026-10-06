import React, { useState, useEffect } from 'react';
import { apiGetMyDeliveries } from '../api/client';
import StatusBadge from '../components/StatusBadge';

export default function ProviderHistoryPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetMyDeliveries()
      .then(data => setDeliveries(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalQuantityRescued = deliveries.reduce((acc, d) => acc + (d.quantity || 0), 0);
  const mealsEquivalent = Math.round(totalQuantityRescued * 2.4);

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 mb-1">
            VERIFIED AUDIT LOG
          </span>
          <h2 className="fw-extrabold text-dark mb-1">Redistribution History</h2>
          <p className="text-secondary small mb-0">
            Historical record of all completed resource transfers and certified community impact.
          </p>
        </div>

        {/* Impact Stat Chips */}
        <div className="d-flex gap-3">
          <div className="bg-white px-3 py-2 rounded-3 border shadow-sm text-center">
            <div className="text-muted small">Total Delivered</div>
            <strong className="text-success fs-6">{totalQuantityRescued} Units</strong>
          </div>
          <div className="bg-white px-3 py-2 rounded-3 border shadow-sm text-center">
            <div className="text-muted small">Meals Equivalent</div>
            <strong className="text-primary fs-6">{mealsEquivalent} Meals</strong>
          </div>
        </div>
      </div>

      <div className="card shadow-soft border-subtle rounded-xl overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-secondary">
              <tr>
                <th className="ps-4">Distribution Item</th>
                <th>Recipient Partner</th>
                <th>Allocated Quantity</th>
                <th>Drop-off Location</th>
                <th>Status</th>
                <th className="pe-4">Completed Date</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <i className="bi bi-clock-history fs-3 d-block mb-2"></i>
                    No completed distributions yet. Accept matches to begin scheduling deliveries.
                  </td>
                </tr>
              ) : (
                deliveries.map((del) => (
                  <tr key={del.id}>
                    <td className="ps-4">
                      <div className="fw-bold text-dark">{del.resourceTitle}</div>
                      <div className="text-muted small">Tracking ID: #{del.id} • {del.resourceCategory}</div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{del.recipientOrg || 'Shelter'}</div>
                      <span className="badge bg-light text-muted border small">Verified Recipient</span>
                    </td>
                    <td className="fw-bold text-success">
                      {del.quantity} {del.unit}
                    </td>
                    <td className="small text-secondary text-truncate" style={{ maxWidth: '200px' }}>
                      {del.deliveryLocation}
                    </td>
                    <td>
                      <StatusBadge status={del.status} />
                    </td>
                    <td className="small text-muted pe-4">
                      {del.receivedTime ? (
                        <>
                          <div>{new Date(del.receivedTime).toLocaleDateString()}</div>
                          <div style={{ fontSize: '0.72rem' }}>{new Date(del.receivedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </>
                      ) : (
                        <span className="text-primary fw-semibold">In Progress</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

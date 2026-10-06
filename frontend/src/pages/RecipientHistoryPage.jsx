import React, { useState, useEffect } from 'react';
import { apiGetMyDeliveries } from '../api/client';
import StatusBadge from '../components/StatusBadge';

export default function RecipientHistoryPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetMyDeliveries()
      .then(data => setDeliveries(data.filter(d => d.status === 'RECEIVED')))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalUnits = deliveries.reduce((acc, d) => acc + (d.quantity || 0), 0);
  const peopleNourished = Math.round(totalUnits * 1.5);

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1 mb-1">
            DISTRIBUTION LOGS
          </span>
          <h2 className="fw-extrabold text-dark mb-1">Receipt History</h2>
          <p className="text-secondary small mb-0">
            Verified records of all food and essential supplies received by your organization.
          </p>
        </div>

        <div className="d-flex gap-3">
          <div className="bg-white px-3 py-2 rounded-3 border shadow-sm text-center">
            <div className="text-muted small">Total Supplies Received</div>
            <strong className="text-primary fs-6">{totalUnits} Units</strong>
          </div>
          <div className="bg-white px-3 py-2 rounded-3 border shadow-sm text-center">
            <div className="text-muted small">People Nourished</div>
            <strong className="text-success fs-6">~{peopleNourished} Individuals</strong>
          </div>
        </div>
      </div>

      <div className="card shadow-soft border-subtle rounded-xl overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-secondary">
              <tr>
                <th className="ps-4">Resource Received</th>
                <th>Provider Organization</th>
                <th>Quantity</th>
                <th>Delivery Destination</th>
                <th>Status</th>
                <th className="pe-4">Received Date</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <i className="bi bi-clock-history fs-3 d-block mb-2"></i>
                    No received shipments recorded yet. Confirm deliveries on the Live Tracking page once they arrive.
                  </td>
                </tr>
              ) : (
                deliveries.map((del) => (
                  <tr key={del.id}>
                    <td className="ps-4">
                      <div className="fw-bold text-dark">{del.resourceTitle}</div>
                      <div className="text-muted small">ID: #{del.id} • {del.resourceCategory}</div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{del.providerOrg || 'Provider'}</div>
                      <span className="badge bg-light text-muted border small">Verified Donor</span>
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
                      {del.receivedTime ? new Date(del.receivedTime).toLocaleDateString() : 'Recorded'}
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

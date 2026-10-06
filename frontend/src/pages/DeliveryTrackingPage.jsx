import React, { useState, useEffect } from 'react';
import { apiGetMyDeliveries, apiConfirmReceipt, apiUpdateDeliveryStatus } from '../api/client';
import StatusBadge from '../components/StatusBadge';

const STEPS = [
  { status: 'REQUESTED', title: 'Requested', desc: 'Requirement logged' },
  { status: 'MATCHED', title: 'Matched', desc: 'Engine linked' },
  { status: 'APPROVED', title: 'Approved', desc: 'Provider accepted' },
  { status: 'PICKUP_SCHEDULED', title: 'Pickup Scheduled', desc: 'Courier dispatched' },
  { status: 'IN_TRANSIT', title: 'In Transit', desc: 'Vehicle on route' },
  { status: 'DELIVERED', title: 'Delivered', desc: 'Arrived at shelter' },
  { status: 'RECEIVED', title: 'Received', desc: 'Verified & recorded' },
];

export default function DeliveryTrackingPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState('');

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      const data = await apiGetMyDeliveries();
      setDeliveries(data);
      if (data.length > 0 && !selectedId) {
        // Default to active delivery or first item
        const active = data.find(d => d.status !== 'RECEIVED') || data[0];
        setSelectedId(active.id);
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedDelivery = deliveries.find(d => d.id === selectedId) || deliveries[0];

  const handleConfirmReceipt = async (deliveryId) => {
    setActionLoading(true);
    setCelebrationMsg('');
    try {
      const updated = await apiConfirmReceipt(deliveryId);
      setDeliveries(prev => prev.map(d => d.id === deliveryId ? updated : d));
      setCelebrationMsg('🎉 Delivery confirmed received! Quality verified and community impact successfully recorded in registry.');
    } catch (e) {
      alert(e.message || 'Failed to confirm receipt');
    } finally {
      setActionLoading(false);
    }
  };

  // Demo simulator helper to advance through steps for university presentation
  const handleAdvanceStep = async (deliveryId, currentStatus) => {
    const statusOrder = ['REQUESTED', 'MATCHED', 'APPROVED', 'PICKUP_SCHEDULED', 'IN_TRANSIT', 'DELIVERED', 'RECEIVED'];
    const curIdx = statusOrder.indexOf(currentStatus);
    if (curIdx >= 0 && curIdx < statusOrder.length - 1) {
      const nextStatus = statusOrder[curIdx + 1];
      setActionLoading(true);
      try {
        const updated = await apiUpdateDeliveryStatus(deliveryId, { status: nextStatus });
        setDeliveries(prev => prev.map(d => d.id === deliveryId ? updated : d));
        if (nextStatus === 'RECEIVED') {
          setCelebrationMsg('🎉 Redistribution completed! Impact updated.');
        }
      } catch (e) {
        alert(e.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-info-subtle text-info border border-info-subtle rounded-pill px-2.5 py-1 mb-1">
            LOGISTICS FULFILLMENT
          </span>
          <h2 className="fw-extrabold text-dark mb-1">Resource Movement & Tracking</h2>
          <p className="text-secondary small mb-0">
            Real-time delivery lifecycle verification, route monitoring, and receipt confirmation.
          </p>
        </div>

        <button className="btn btn-outline-secondary btn-sm" onClick={loadDeliveries}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Status
        </button>
      </div>

      {celebrationMsg && (
        <div className="alert alert-success border-success rounded-xl p-4 mb-4 shadow-sm">
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-patch-check-fill text-success display-6"></i>
            <div>
              <h5 className="fw-bold text-dark mb-1">Receipt Confirmed Successfully!</h5>
              <div className="text-secondary small">{celebrationMsg}</div>
            </div>
          </div>
        </div>
      )}

      {deliveries.length === 0 ? (
        <div className="card shadow-soft border-subtle rounded-xl p-5 text-center bg-white">
          <i className="bi bi-truck text-muted display-4 mb-3"></i>
          <h5 className="fw-bold text-dark mb-1">No active deliveries currently in progress</h5>
          <p className="text-muted small mb-0">
            When a surplus resource match is approved, real-time shipment tracking will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {/* Left Column: Delivery Selector */}
          <div className="col-lg-4">
            <h6 className="fw-bold text-dark mb-3">Redistribution Shipments</h6>
            <div className="d-flex flex-column gap-2">
              {deliveries.map((del) => {
                const isSelected = del.id === selectedId;
                return (
                  <div
                    key={del.id}
                    className={`card p-3 rounded-xl cursor-pointer border transition-all ${isSelected ? 'border-primary shadow-sm bg-primary-subtle bg-opacity-10' : 'border-subtle bg-white hover-bg-light'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedId(del.id)}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <span className="fw-bold text-dark small text-truncate" style={{ maxWidth: '180px' }}>
                        {del.resourceTitle}
                      </span>
                      <StatusBadge status={del.status} />
                    </div>
                    <div className="text-muted small mb-1">
                      From: {del.providerOrg}
                    </div>
                    <div className="d-flex justify-content-between align-items-center small text-secondary">
                      <span>{del.quantity} {del.unit}</span>
                      <span className="text-primary fw-semibold">Step {del.stepNumber} of 7</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Lifecycle Stepper */}
          {selectedDelivery && (
            <div className="col-lg-8">
              <div className="card shadow-soft border-subtle rounded-xl p-4 p-md-5 bg-white">
                <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4 flex-wrap gap-2">
                  <div>
                    <span className="badge bg-light text-muted border mb-1">
                      Tracking #TRK-{selectedDelivery.id.toString().padStart(5, '0')}
                    </span>
                    <h4 className="fw-extrabold text-dark mb-1">{selectedDelivery.resourceTitle}</h4>
                    <div className="text-secondary small">
                      Allocated from <strong>{selectedDelivery.providerOrg}</strong> to <strong>{selectedDelivery.recipientOrg}</strong>
                    </div>
                  </div>
                  <div className="text-end">
                    <StatusBadge status={selectedDelivery.status} />
                    <div className="text-muted small mt-1">
                      Updated: {new Date(selectedDelivery.updatedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                {/* VISUAL 7-STAGE PROGRESS STEPPER */}
                <div className="mb-5 overflow-auto py-2">
                  <div className="d-flex justify-content-between position-relative" style={{ minWidth: '580px' }}>
                    {/* Connecting line */}
                    <div
                      className="position-absolute top-50 start-0 w-100 translate-middle-y bg-light"
                      style={{ height: '4px', zIndex: 1 }}
                    >
                      <div
                        className="bg-success h-100 transition-all"
                        style={{ width: `${selectedDelivery.progressPercentage}%` }}
                      ></div>
                    </div>

                    {STEPS.map((step, idx) => {
                      const stepNum = idx + 1;
                      const isDone = selectedDelivery.stepNumber > stepNum;
                      const isCurrent = selectedDelivery.stepNumber === stepNum;

                      return (
                        <div key={step.status} className="text-center position-relative" style={{ zIndex: 2, width: '75px' }}>
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 fw-bold transition-all ${
                              isDone
                                ? 'bg-success text-white shadow-sm'
                                : isCurrent
                                ? 'bg-primary text-white shadow ring-4 ring-primary-subtle'
                                : 'bg-white border text-muted'
                            }`}
                            style={{ width: '38px', height: '38px', fontSize: '0.85rem' }}
                          >
                            {isDone ? <i className="bi bi-check-lg"></i> : stepNum}
                          </div>
                          <div className={`fw-bold small ${isCurrent ? 'text-primary' : 'text-dark'}`} style={{ fontSize: '0.72rem' }}>
                            {step.title}
                          </div>
                          <div className="text-muted d-none d-md-block" style={{ fontSize: '0.65rem' }}>
                            {step.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Logistics Metadata & OTP Section */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="bg-light p-3 rounded-3 border h-100">
                      <div className="fw-bold text-dark small mb-2">
                        <i className="bi bi-geo-alt text-danger me-1"></i> Transit Route Coordinates
                      </div>
                      <div className="text-secondary small mb-1">
                        <strong>Pickup:</strong> {selectedDelivery.pickupLocation}
                      </div>
                      <div className="text-secondary small">
                        <strong>Destination:</strong> {selectedDelivery.deliveryLocation}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="bg-light p-3 rounded-3 border h-100">
                      <div className="fw-bold text-dark small mb-2">
                        <i className="bi bi-shield-lock text-primary me-1"></i> Digital Handshake Verification
                      </div>
                      <div className="d-flex gap-3">
                        <div>
                          <div className="text-muted small" style={{ fontSize: '0.72rem' }}>PICKUP OTP</div>
                          <span className="badge bg-white text-dark border font-monospace fs-6 px-2.5 py-1">
                            {selectedDelivery.pickupOtp || '4821'}
                          </span>
                        </div>
                        <div>
                          <div className="text-muted small" style={{ fontSize: '0.72rem' }}>DELIVERY OTP</div>
                          <span className="badge bg-white text-dark border font-monospace fs-6 px-2.5 py-1">
                            {selectedDelivery.deliveryOtp || '9012'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Confirmation Panel */}
                <div className="p-3 bg-light rounded-3 border d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div>
                    <div className="fw-bold text-dark small">Current Operational Status</div>
                    <div className="text-muted small">
                      {selectedDelivery.status === 'RECEIVED'
                        ? 'Redistribution fully concluded and impact verified.'
                        : 'Driver / courier is handling logistics. Click "Confirm Receipt" once items arrive safely.'}
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    {selectedDelivery.status !== 'RECEIVED' && (
                      <>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          title="Simulate next logistical step for presentation"
                          onClick={() => handleAdvanceStep(selectedDelivery.id, selectedDelivery.status)}
                          disabled={actionLoading}
                        >
                          <i className="bi bi-fast-forward me-1"></i> Simulate Step
                        </button>
                        <button
                          className="btn btn-primary-custom shadow-sm"
                          onClick={() => handleConfirmReceipt(selectedDelivery.id)}
                          disabled={actionLoading}
                        >
                          {actionLoading ? (
                            <span><span className="spinner-border spinner-border-sm me-1"></span> Processing...</span>
                          ) : (
                            <span><i className="bi bi-check2-circle me-1"></i> Confirm Receipt</span>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

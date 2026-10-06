import React, { useState } from 'react';

export default function SettingsPage() {
  const [minScore, setMinScore] = useState(60);
  const [maxRadius, setMaxRadius] = useState(25);
  const [expiryWarningHrs, setExpiryWarningHrs] = useState(6);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inAppSound, setInAppSound] = useState(true);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMsg('Settings and matching engine preferences saved successfully.');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-soft border-subtle rounded-xl p-4 p-md-5 bg-white">
            <div className="mb-4 border-bottom pb-3">
              <span className="badge bg-light text-secondary border mb-1">PREFERENCES</span>
              <h3 className="fw-extrabold text-dark mb-1">System & Engine Settings</h3>
              <p className="text-secondary small mb-0">
                Configure algorithmic scoring thresholds, notification triggers, and operational parameters.
              </p>
            </div>

            {savedMsg && (
              <div className="alert alert-success py-2 small rounded-3 d-flex align-items-center gap-2 mb-4">
                <i className="bi bi-check-circle-fill"></i>
                <span>{savedMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave}>
              {/* Algorithm Configuration */}
              <div className="mb-4">
                <h5 className="fw-bold text-dark mb-3">
                  <i className="bi bi-cpu text-primary me-2"></i> Matching Engine Parameters
                </h5>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold text-secondary mb-0">
                      Minimum Match Score Cutoff
                    </label>
                    <span className="badge bg-primary text-white fw-bold">{minScore} / 100</span>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="40"
                    max="90"
                    value={minScore}
                    onChange={(e) => setMinScore(e.target.value)}
                  />
                  <div className="form-text text-muted small" style={{ fontSize: '0.75rem' }}>
                    Only pairings reaching this score will be surfaced as active recommendations.
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold text-secondary mb-0">
                      Maximum Transit Radius (Haversine Distance)
                    </label>
                    <span className="badge bg-success text-white fw-bold">{maxRadius} km</span>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="5"
                    max="50"
                    value={maxRadius}
                    onChange={(e) => setMaxRadius(e.target.value)}
                  />
                  <div className="form-text text-muted small" style={{ fontSize: '0.75rem' }}>
                    Pairs located beyond this radius receive steep distance attenuation penalties.
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold text-secondary mb-0">
                      Surplus Expiry Warning Lead Time
                    </label>
                    <span className="badge bg-warning text-dark fw-bold">{expiryWarningHrs} Hours</span>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="2"
                    max="24"
                    value={expiryWarningHrs}
                    onChange={(e) => setExpiryWarningHrs(e.target.value)}
                  />
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="mb-4 border-top pt-4">
                <h5 className="fw-bold text-dark mb-3">
                  <i className="bi bi-bell text-warning me-2"></i> Alert & Notification Delivery
                </h5>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="emailSwitch"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                  />
                  <label className="form-check-label fw-semibold text-dark small" htmlFor="emailSwitch">
                    Email Notifications for High & Critical Priority Matches
                  </label>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Receive automated dispatch emails when a 90+ score match is generated.
                  </div>
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="soundSwitch"
                    checked={inAppSound}
                    onChange={(e) => setInAppSound(e.target.checked)}
                  />
                  <label className="form-check-label fw-semibold text-dark small" htmlFor="soundSwitch">
                    In-App Live Status Audio Alerts
                  </label>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Play auditory chimes on live delivery tracking transitions.
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end border-top pt-3">
                <button type="submit" className="btn btn-primary-custom px-4 shadow-sm">
                  Save Preferences
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

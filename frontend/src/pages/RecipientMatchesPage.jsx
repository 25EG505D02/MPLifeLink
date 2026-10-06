import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiGetRecipientMatches, apiAcceptMatch } from '../api/client';
import StatusBadge from '../components/StatusBadge';

export default function RecipientMatchesPage() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await apiGetRecipientMatches();
      setMatches(data);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (matchId) => {
    setClaimingId(matchId);
    setMessage('');
    try {
      await apiAcceptMatch(matchId);
      setMessage('Surplus match successfully accepted! Delivery workflow activated.');
      setTimeout(() => {
        navigate('/recipient/tracking');
      }, 1800);
    } catch (e) {
      alert(e.message || 'Failed to claim resource');
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1">
              <i className="bi bi-cpu-fill me-1"></i> ALGORITHMIC ALLOCATION
            </span>
            <span className="badge bg-success-subtle text-success rounded-pill px-2.5 py-1">
              Haversine Proximity Ranked
            </span>
          </div>
          <h2 className="fw-extrabold text-dark mb-1">Matching Surplus Resources</h2>
          <p className="text-secondary small mb-0">
            Available surplus items ranked for your open community requirements by the intelligent matching engine.
          </p>
        </div>

        <button className="btn btn-outline-secondary btn-sm" onClick={loadMatches}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Matches
        </button>
      </div>

      {message && (
        <div className="alert alert-success border-success rounded-xl p-3 mb-4 shadow-sm d-flex align-items-center gap-2">
          <i className="bi bi-check-circle-fill text-success fs-5"></i>
          <div>{message}</div>
        </div>
      )}

      {matches.length === 0 ? (
        <div className="card shadow-soft border-subtle rounded-xl p-5 text-center bg-white">
          <i className="bi bi-cpu text-muted display-4 mb-3"></i>
          <h5 className="fw-bold text-dark mb-1">No matching surplus found right now</h5>
          <p className="text-muted small mb-3">
            Make sure your organization has open requirements. The engine continuously matches active surplus in your sector.
          </p>
          <div>
            <Link to="/recipient/request/new" className="btn btn-primary-custom btn-sm">
              Post Requirement
            </Link>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {matches.map((match, index) => {
            const isTopMatch = index === 0;
            const isAccepted = match.status === 'ACCEPTED';

            return (
              <div
                key={match.id}
                className={`card shadow-soft rounded-xl p-4 bg-white transition-all ${isTopMatch ? 'border-primary border-2' : 'border-subtle'}`}
              >
                <div className="row align-items-center g-4">
                  {/* Score & Rank */}
                  <div className="col-md-2 text-center text-md-start d-flex flex-column align-items-center">
                    <span className="badge bg-primary text-white rounded-pill px-2.5 py-1 mb-2 small">
                      #{index + 1} Best Fit
                    </span>
                    <div className="score-badge-circle high-match">
                      <span className="fs-4 lh-1">{Math.round(match.score)}</span>
                      <span className="small text-muted" style={{ fontSize: '0.65rem' }}>/ 100</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="col-md-7">
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <h5 className="fw-bold text-dark mb-0">{match.resourceTitle}</h5>
                      <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill small">
                        {match.resourceCategory?.replace(/_/g, ' ')}
                      </span>
                      <span className="badge bg-light text-dark border">
                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                        {match.distanceKm} km away
                      </span>
                    </div>

                    <div className="text-secondary small mb-2">
                      <strong>Offered By:</strong> {match.providerOrgName || 'Provider'} •
                      <span className="ms-1 text-primary fw-semibold">
                        Pickup: {match.resourcePickupLocation}
                      </span>
                    </div>

                    <div className="reason-box mb-3">
                      <i className="bi bi-stars text-primary me-1"></i>
                      <strong>Why Recommended:</strong> {match.matchReason}
                    </div>

                    <div className="d-flex align-items-center gap-3 text-muted small">
                      <div>
                        <span>Demand Covered: </span>
                        <strong className="text-dark">{match.allocatedQuantity} {match.resourceUnit}</strong>
                      </div>
                      <div>•</div>
                      <div>
                        <span>Proximity Score: </span>
                        <strong className="text-primary">{match.distanceKm} km transit</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-md-3 text-center text-md-end">
                    {isAccepted ? (
                      <div className="d-flex flex-column align-items-md-end gap-1">
                        <span className="badge bg-success px-3 py-2 rounded-pill fs-7">
                          <i className="bi bi-check-circle-fill me-1"></i> Request Approved
                        </span>
                        <Link to="/recipient/tracking" className="btn btn-sm btn-link text-primary text-decoration-none">
                          Track Live Delivery →
                        </Link>
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary-custom shadow-sm py-2 px-4"
                        disabled={claimingId === match.id}
                        onClick={() => handleClaim(match.id)}
                      >
                        {claimingId === match.id ? (
                          <span><span className="spinner-border spinner-border-sm me-1"></span> Claiming...</span>
                        ) : (
                          <span><i className="bi bi-hand-thumbs-up me-1"></i> Request Resource</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiGetProviderMatches, apiAcceptMatch, apiRejectMatch } from '../api/client';
import StatusBadge from '../components/StatusBadge';

export default function ProviderMatchesPage() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await apiGetProviderMatches();
      setMatches(data);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (matchId) => {
    setAcceptingId(matchId);
    setMessage('');
    try {
      await apiAcceptMatch(matchId);
      setMessage('Match successfully approved! Logistics pickup scheduled with automated OTP codes.');
      // Refresh list
      loadMatches();
      setTimeout(() => {
        navigate('/provider/history');
      }, 2000);
    } catch (e) {
      alert(e.message || 'Failed to accept match');
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (matchId) => {
    if (window.confirm('Decline this algorithmic recommendation?')) {
      try {
        await apiRejectMatch(matchId);
        setMatches(prev => prev.filter(m => m.id !== matchId));
      } catch (e) {
        alert(e.message);
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1">
              <i className="bi bi-cpu-fill me-1"></i> JAVA MATCHING & PRIORITY ENGINE
            </span>
            <span className="badge bg-success-subtle text-success rounded-pill px-2.5 py-1">
              Max-Heap PriorityQueue
            </span>
          </div>
          <h2 className="fw-extrabold text-dark mb-1">Intelligent Resource Matches</h2>
          <p className="text-secondary small mb-0">
            Algorithmic ranking optimizing compatibility, urgency, priority weighting, and Haversine transit distance.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={loadMatches}>
            <i className="bi bi-arrow-clockwise me-1"></i> Re-Calculate Scores
          </button>
          <Link to="/provider/surplus/new" className="btn btn-primary-custom btn-sm">
            <i className="bi bi-plus-circle me-1"></i> Add Surplus
          </Link>
        </div>
      </div>

      {message && (
        <div className="alert alert-success border-success rounded-xl p-3 mb-4 shadow-sm d-flex align-items-center gap-2">
          <i className="bi bi-check-circle-fill text-success fs-5"></i>
          <div>{message}</div>
        </div>
      )}

      {/* Algorithm Logic Explanation Card */}
      <div className="card shadow-soft border-primary border-opacity-25 rounded-xl p-3 mb-4 bg-light">
        <div className="row align-items-center g-3">
          <div className="col-lg-3 col-md-4 text-center text-md-start border-md-end">
            <div className="fw-bold text-dark mb-1">Scoring Criteria Weighting:</div>
            <div className="text-muted small">Multi-attribute dynamic evaluation</div>
          </div>
          <div className="col-lg-9 col-md-8">
            <div className="row g-2 text-center text-md-start">
              <div className="col-sm-3 col-6">
                <div className="bg-white p-2 rounded-3 border">
                  <div className="fw-bold text-danger">30% Priority</div>
                  <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Critical & High Demands</div>
                </div>
              </div>
              <div className="col-sm-3 col-6">
                <div className="bg-white p-2 rounded-3 border">
                  <div className="fw-bold text-primary">25% Distance</div>
                  <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Haversine Proximity</div>
                </div>
              </div>
              <div className="col-sm-3 col-6">
                <div className="bg-white p-2 rounded-3 border">
                  <div className="fw-bold text-success">25% Quantity Fit</div>
                  <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Demand Alignment</div>
                </div>
              </div>
              <div className="col-sm-3 col-6">
                <div className="bg-white p-2 rounded-3 border">
                  <div className="fw-bold text-warning">20% Urgency</div>
                  <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Expiry Decay Window</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      {matches.length === 0 ? (
        <div className="card shadow-soft border-subtle rounded-xl p-5 text-center bg-white">
          <i className="bi bi-cpu text-muted display-4 mb-3"></i>
          <h5 className="fw-bold text-dark mb-1">No compatible matches found right now</h5>
          <p className="text-muted small mb-0">
            As soon as an organization submits a requirement matching your surplus category, the engine will automatically rank them here.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {matches.map((match, index) => {
            const isAccepted = match.status === 'ACCEPTED';
            const isTopMatch = index === 0;

            return (
              <div
                key={match.id}
                className={`card shadow-soft rounded-xl p-4 transition-all bg-white ${isTopMatch ? 'border-success border-2' : 'border-subtle'}`}
              >
                <div className="row align-items-center g-4">
                  {/* Rank & Score Column */}
                  <div className="col-md-2 text-center text-md-start d-flex flex-column align-items-center">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge bg-dark text-white rounded-pill px-2.5 py-1 small">
                        #{index + 1} Best Match
                      </span>
                    </div>
                    <div className={`score-badge-circle ${match.score >= 90 ? 'high-match' : 'med-match'}`}>
                      <span className="fs-4 lh-1">{Math.round(match.score)}</span>
                      <span className="small text-muted" style={{ fontSize: '0.65rem' }}>/ 100</span>
                    </div>
                  </div>

                  {/* Recipient & Resource Info */}
                  <div className="col-md-7">
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <h5 className="fw-bold text-dark mb-0">{match.recipientOrgName || 'Community Shelter'}</h5>
                      <StatusBadge status={match.requestPriority} />
                      <span className="badge bg-light text-secondary border">
                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                        {match.distanceKm} km away
                      </span>
                    </div>

                    <div className="text-secondary small mb-2">
                      <strong>Surplus Item:</strong> {match.resourceTitle} •
                      <span className="ms-1 text-primary fw-semibold">
                        Allocating {match.allocatedQuantity} of {match.requestedQuantity} needed {match.resourceUnit}
                      </span>
                    </div>

                    {/* Recommendation Reason Highlight Box */}
                    <div className="reason-box mb-3">
                      <i className="bi bi-stars text-success me-1"></i>
                      <strong>Algorithmic Rationale:</strong> {match.matchReason}
                    </div>

                    {/* Sub-score Progress Meters */}
                    <div className="row g-2 text-muted" style={{ fontSize: '0.75rem' }}>
                      <div className="col-sm-3 col-6">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Priority:</span>
                          <strong>{Math.round(match.priorityScore)}%</strong>
                        </div>
                        <div className="progress" style={{ height: '4px' }}>
                          <div className="progress-bar bg-danger" style={{ width: `${match.priorityScore}%` }}></div>
                        </div>
                      </div>
                      <div className="col-sm-3 col-6">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Proximity:</span>
                          <strong>{match.distanceKm} km</strong>
                        </div>
                        <div className="progress" style={{ height: '4px' }}>
                          <div className="progress-bar bg-primary" style={{ width: `${Math.max(10, 100 - (match.distanceKm * 5))}%` }}></div>
                        </div>
                      </div>
                      <div className="col-sm-3 col-6">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Quantity Fit:</span>
                          <strong>{Math.round(match.quantityFitScore)}%</strong>
                        </div>
                        <div className="progress" style={{ height: '4px' }}>
                          <div className="progress-bar bg-success" style={{ width: `${match.quantityFitScore}%` }}></div>
                        </div>
                      </div>
                      <div className="col-sm-3 col-6">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Urgency:</span>
                          <strong>{Math.round(match.urgencyScore)}%</strong>
                        </div>
                        <div className="progress" style={{ height: '4px' }}>
                          <div className="progress-bar bg-warning" style={{ width: `${match.urgencyScore}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="col-md-3 text-center text-md-end">
                    {isAccepted ? (
                      <div className="d-flex flex-column align-items-md-end gap-1">
                        <span className="badge bg-success px-3 py-2 rounded-pill fs-7">
                          <i className="bi bi-check-circle-fill me-1"></i> Match Accepted
                        </span>
                        <span className="text-muted small">Pickup Scheduled</span>
                        <Link to="/provider/history" className="btn btn-sm btn-link text-success text-decoration-none">
                          View in History →
                        </Link>
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-2">
                        <button
                          className="btn btn-primary-custom shadow-sm py-2"
                          disabled={acceptingId === match.id}
                          onClick={() => handleAccept(match.id)}
                        >
                          {acceptingId === match.id ? (
                            <span><span className="spinner-border spinner-border-sm me-1"></span> Approving...</span>
                          ) : (
                            <span><i className="bi bi-check2-circle me-1"></i> Accept Match</span>
                          )}
                        </button>
                        <button
                          className="btn btn-sm btn-light border text-muted"
                          onClick={() => handleReject(match.id)}
                        >
                          Decline
                        </button>
                      </div>
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

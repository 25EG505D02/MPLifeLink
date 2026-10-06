import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGetAllActiveResources } from '../api/client';

export default function LandingPage() {
  const [activeSurplus, setActiveSurplus] = useState([]);

  useEffect(() => {
    apiGetAllActiveResources()
      .then(data => setActiveSurplus(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="landing-container">
      {/* HERO SECTION */}
      <section className="py-5 py-lg-6 bg-surface position-relative overflow-hidden border-bottom">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-success-subtle text-success border border-success-subtle mb-3 fw-semibold small">
                <i className="bi bi-stars"></i> Intelligent Algorithmic Redistribution Platform
              </div>
              <h1 className="display-4 fw-extrabold text-dark tracking-tight mb-3" style={{ lineHeight: 1.15 }}>
                Bridge Surplus Resources to <span className="text-success">Communities in Need</span> in Real-Time.
              </h1>
              <p className="lead text-secondary mb-4">
                LIFELINK connects corporate cafeterias, restaurants, and grocers with nearby verified shelters and food banks. Powered by a Java-based <strong>Resource Matching & Priority Engine</strong> that optimizes allocation, calculates proximity, and coordinates end-to-end delivery tracking.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to="/register" className="btn btn-lg btn-primary-custom shadow">
                  Join as Provider or Recipient <i className="bi bi-arrow-right ms-1"></i>
                </Link>
                <Link to="/login" className="btn btn-lg btn-outline-custom">
                  One-Click Demo Login
                </Link>
              </div>
              <div className="d-flex align-items-center gap-4 text-muted small pt-2">
                <div className="d-flex align-items-center gap-1">
                  <i className="bi bi-shield-check text-success fs-5"></i> 100% Verified NGOs
                </div>
                <div className="d-flex align-items-center gap-1">
                  <i className="bi bi-geo-alt text-primary fs-5"></i> Haversine Proximity
                </div>
                <div className="d-flex align-items-center gap-1">
                  <i className="bi bi-lightning-charge text-warning fs-5"></i> Multi-Criteria Scoring
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              {/* Interactive Scenario Card Preview */}
              <div className="card shadow-lg border-0 rounded-xl overflow-hidden bg-gradient-dark text-white p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-success text-white px-3 py-1.5 rounded-pill fw-bold">
                    ACTIVE ENGINE SCENARIO
                  </span>
                  <span className="small text-white-50">PriorityQueue Engine</span>
                </div>
                <h5 className="fw-bold mb-1">Campus Central Cafeteria</h5>
                <p className="small text-white-50 mb-3">50 Prepared Meals • Expiry: 4.0 hrs</p>

                <div className="bg-white bg-opacity-10 rounded-3 p-3 mb-3 border border-white border-opacity-10">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold small text-white">Top Match: Hope Shelter</span>
                    <span className="badge bg-warning text-dark fw-bold">Score: 94.2/100</span>
                  </div>
                  <div className="text-white-50 small mb-2">Distance: 1.5 km • 30 Portions Needed</div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-success" style={{ width: '94%' }}></div>
                  </div>
                </div>

                <div className="bg-white bg-opacity-10 rounded-3 p-3 mb-3 border border-white border-opacity-10">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold small text-white">Runner-Up: Youth Care Center</span>
                    <span className="badge bg-light text-dark fw-bold">Score: 89.8/100</span>
                  </div>
                  <div className="text-white-50 small mb-2">Distance: 3.2 km • 20 Portions Needed</div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-info" style={{ width: '89%' }}></div>
                  </div>
                </div>

                <div className="p-2 bg-success bg-opacity-20 border border-success border-opacity-30 rounded-3 text-center small text-light">
                  <i className="bi bi-check2-all me-1"></i> Greedy Allocation: 100% of 50 portions assigned
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REDISTRIBUTION WORKFLOW PROCESS DIAGRAM */}
      <section id="how-it-works" className="py-5 bg-light border-bottom">
        <div className="container py-3">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold mb-2">
              ALGORITHMIC ARCHITECTURE
            </span>
            <h2 className="fw-extrabold text-dark">How LIFELINK Works</h2>
            <p className="text-secondary">
              A systematic multi-tier redistribution pipeline connecting supply, intelligence, and logistical execution.
            </p>
          </div>

          {/* Visual Step Cards */}
          <div className="row g-4 align-items-stretch">
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 shadow-soft border-subtle rounded-xl p-4 text-center">
                <div className="kpi-icon-box bg-success-subtle text-success mx-auto mb-3">
                  <i className="bi bi-building"></i>
                </div>
                <div className="fw-bold text-muted small mb-1">STEP 1</div>
                <h5 className="fw-bold text-dark mb-2">Resource Provider</h5>
                <p className="text-secondary small mb-0">
                  Cafeterias and restaurants post surplus listings with category, quantity, expiration window, and pickup coordinates.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card h-100 shadow-soft border-primary border-2 rounded-xl p-4 text-center bg-white">
                <div className="kpi-icon-box bg-primary-subtle text-primary mx-auto mb-3">
                  <i className="bi bi-cpu"></i>
                </div>
                <div className="fw-bold text-primary small mb-1">STEP 2 (CORE ENGINE)</div>
                <h5 className="fw-bold text-dark mb-2">Priority & Matching Engine</h5>
                <p className="text-secondary small mb-0">
                  Evaluates priority (30%), Haversine distance (25%), quantity fit (25%), and urgency (20%) using a Max-Heap PriorityQueue.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card h-100 shadow-soft border-subtle rounded-xl p-4 text-center">
                <div className="kpi-icon-box bg-warning-subtle text-warning mx-auto mb-3">
                  <i className="bi bi-shield-heart"></i>
                </div>
                <div className="fw-bold text-muted small mb-1">STEP 3</div>
                <h5 className="fw-bold text-dark mb-2">Recipient Organization</h5>
                <p className="text-secondary small mb-0">
                  Verified shelters receive real-time ranked surplus recommendations with clear mathematical justification reasons.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card h-100 shadow-soft border-subtle rounded-xl p-4 text-center">
                <div className="kpi-icon-box bg-info-subtle text-info mx-auto mb-3">
                  <i className="bi bi-truck"></i>
                </div>
                <div className="fw-bold text-muted small mb-1">STEP 4</div>
                <h5 className="fw-bold text-dark mb-2">Fulfillment & Impact</h5>
                <p className="text-secondary small mb-0">
                  7-step delivery tracking with OTP authentication, safe receipt verification, and real-time carbon offset logging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT METRICS */}
      <section id="impact" className="py-5 bg-white border-bottom">
        <div className="container py-3">
          <div className="row g-4 text-center">
            <div className="col-md-3 col-6">
              <div className="p-3">
                <h2 className="display-5 fw-extrabold text-success mb-1">3,450+</h2>
                <div className="fw-semibold text-dark">Kilograms Rescued</div>
                <div className="text-muted small">diverted from landfill waste</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3">
                <h2 className="display-5 fw-extrabold text-primary mb-1">8,280+</h2>
                <div className="fw-semibold text-dark">Wholesome Meals</div>
                <div className="text-muted small">served to vulnerable persons</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3">
                <h2 className="display-5 fw-extrabold text-warning mb-1">8,625 kg</h2>
                <div className="fw-semibold text-dark">CO₂ Footprint Avoided</div>
                <div className="text-muted small">verified climate impact</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3">
                <h2 className="display-5 fw-extrabold text-dark mb-1">100%</h2>
                <div className="fw-semibold text-dark">Verified Organizations</div>
                <div className="text-muted small">strict credential auditing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE SURPLUS PREVIEW */}
      {activeSurplus.length > 0 && (
        <section className="py-5 bg-light border-bottom">
          <div className="container py-2">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="fw-bold text-dark mb-1">Live Surplus Feed</h3>
                <p className="text-secondary small mb-0">Fresh resources currently available for registered shelters</p>
              </div>
              <Link to="/login" className="btn btn-outline-custom btn-sm">
                View All Listings <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            <div className="row g-4">
              {activeSurplus.map((item) => (
                <div key={item.id} className="col-md-4">
                  <div className="card h-100 shadow-soft border-subtle rounded-xl overflow-hidden">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.title} className="resource-card-img" />
                    )}
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill small">
                          {item.category.replace(/_/g, ' ')}
                        </span>
                        <span className="badge bg-light text-dark border">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <h6 className="fw-bold text-dark mb-1 text-truncate">{item.title}</h6>
                      <p className="text-muted small mb-2">{item.organizationName || item.providerName}</p>
                      <div className="d-flex align-items-center gap-1 text-secondary small">
                        <i className="bi bi-geo-alt text-danger"></i>
                        <span className="text-truncate">{item.pickupLocation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CALL TO ACTION */}
      <section className="py-5 bg-gradient-emerald text-white text-center">
        <div className="container py-4">
          <h2 className="display-6 fw-extrabold mb-3">Ready to Eliminate Waste and Empower Communities?</h2>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: '650px' }}>
            Join restaurants, cafeterias, NGOs, and food banks on the LIFELINK intelligent redistribution network.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/register" className="btn btn-light text-success fw-bold px-4 py-2.5 rounded-3 shadow">
              Create Account
            </Link>
            <Link to="/login" className="btn btn-outline-light px-4 py-2.5 rounded-3">
              Explore Demo Environment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

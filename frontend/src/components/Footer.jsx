import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-top mt-auto py-5 text-secondary">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-5 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-heart-pulse-fill text-danger fs-3"></i>
              <span className="fw-bolder fs-4 text-dark" style={{ letterSpacing: '-0.5px' }}>
                LIFE<span className="text-success">LINK</span>
              </span>
            </div>
            <p className="small pe-lg-4 text-muted">
              Intelligent Surplus Food & Resource Redistribution Platform. Solving real-world redistribution problems through high-precision multi-criteria algorithmic matching, priority scheduling, and automated delivery fulfillment.
            </p>
            <div className="d-flex align-items-center gap-2 small text-success fw-semibold">
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                ● Matching Engine Active
              </span>
              <span>Java Algorithmic Scoring V2.4</span>
            </div>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold text-dark mb-3">Redistribution</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/provider/surplus/new" className="text-muted text-decoration-none hover-dark">Post Food Surplus</Link></li>
              <li><Link to="/recipient/request/new" className="text-muted text-decoration-none hover-dark">Request Food Aid</Link></li>
              <li><Link to="/provider/matches" className="text-muted text-decoration-none hover-dark">Algorithmic Matches</Link></li>
              <li><Link to="/recipient/tracking" className="text-muted text-decoration-none hover-dark">Delivery Stepper</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold text-dark mb-3">Platform</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/" className="text-muted text-decoration-none hover-dark">Landing Overview</Link></li>
              <li><Link to="/login" className="text-muted text-decoration-none hover-dark">Demo Login</Link></li>
              <li><Link to="/register" className="text-muted text-decoration-none hover-dark">Organization Register</Link></li>
              <li><Link to="/admin/analytics" className="text-muted text-decoration-none hover-dark">Live Impact Analytics</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-dark mb-3">Demonstration Ready</h6>
            <p className="small text-muted mb-2">
              Built with Spring Boot 4 / Java 21, Hibernate JPA, MySQL, Spring Security JWT, and React.
            </p>
            <div className="bg-light p-3 rounded-3 border small">
              <span className="fw-bold text-dark">Demo Campus Scenario:</span>
              <div className="text-muted mt-1">Campus Cafeteria 50 Portions matched with Hope Shelter & Youth Care.</div>
            </div>
          </div>
        </div>

        <div className="border-top mt-4 pt-3 d-flex flex-column flex-sm-row justify-content-between align-items-center small text-muted">
          <div>© {new Date().getFullYear()} LIFELINK Platform. All rights reserved. University Major Project.</div>
          <div className="d-flex gap-3 mt-2 mt-sm-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Audit Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

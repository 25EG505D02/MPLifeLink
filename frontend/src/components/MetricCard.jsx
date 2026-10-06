import React from 'react';

export default function MetricCard({ title, value, subtitle, icon, iconBg = 'bg-primary-subtle text-primary', badgeText, badgeBg = 'bg-success-subtle text-success' }) {
  return (
    <div className="card shadow-soft border-subtle rounded-xl p-3 h-100 transition-all hover-translate">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className={`kpi-icon-box ${iconBg}`}>
          <i className={`bi ${icon}`}></i>
        </div>
        {badgeText && (
          <span className={`badge ${badgeBg} rounded-pill px-2 py-1 small fw-semibold`}>
            {badgeText}
          </span>
        )}
      </div>
      <div>
        <div className="text-secondary small fw-medium mb-1">{title}</div>
        <h3 className="fw-bold text-dark mb-1">{value}</h3>
        {subtitle && <div className="text-muted small">{subtitle}</div>}
      </div>
    </div>
  );
}

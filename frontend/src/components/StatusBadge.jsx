import React from 'react';

export default function StatusBadge({ status }) {
  if (!status) return null;

  let bgClass = 'bg-secondary text-white';
  let icon = 'bi-circle';

  switch (status.toUpperCase()) {
    // Resource Statuses
    case 'AVAILABLE':
      bgClass = 'bg-success-subtle text-success border border-success-subtle';
      icon = 'bi-check-circle-fill';
      break;
    case 'OPEN':
      bgClass = 'bg-primary-subtle text-primary border border-primary-subtle';
      icon = 'bi-broadcast';
      break;
    case 'MATCHED':
      bgClass = 'bg-info-subtle text-info-emphasis border border-info-subtle';
      icon = 'bi-cpu-fill';
      break;
    case 'COLLECTED':
      bgClass = 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';
      icon = 'bi-box-seam';
      break;
    case 'COMPLETED':
    case 'FULFILLED':
    case 'RECEIVED':
      bgClass = 'bg-success text-white';
      icon = 'bi-patch-check-fill';
      break;
    case 'EXPIRED':
    case 'CANCELLED':
    case 'REJECTED':
      bgClass = 'bg-danger-subtle text-danger border border-danger-subtle';
      icon = 'bi-x-circle-fill';
      break;

    // Delivery Statuses
    case 'REQUESTED':
      bgClass = 'bg-light text-secondary border';
      icon = 'bi-clock';
      break;
    case 'APPROVED':
      bgClass = 'bg-primary text-white';
      icon = 'bi-shield-check';
      break;
    case 'PICKUP_SCHEDULED':
      bgClass = 'bg-warning-subtle text-dark border border-warning';
      icon = 'bi-calendar2-check';
      break;
    case 'IN_TRANSIT':
      bgClass = 'bg-info text-white';
      icon = 'bi-truck';
      break;
    case 'DELIVERED':
      bgClass = 'bg-teal-subtle text-teal border';
      icon = 'bi-box2-heart-fill';
      break;

    // Priority Statuses
    case 'CRITICAL':
      bgClass = 'bg-danger text-white';
      icon = 'bi-exclamation-triangle-fill';
      break;
    case 'HIGH':
      bgClass = 'bg-warning text-dark';
      icon = 'bi-arrow-up-circle-fill';
      break;
    case 'MEDIUM':
      bgClass = 'bg-info-subtle text-primary border border-info-subtle';
      icon = 'bi-dash-circle';
      break;
    case 'LOW':
      bgClass = 'bg-light text-muted border';
      icon = 'bi-arrow-down-circle';
      break;

    default:
      bgClass = 'bg-secondary text-white';
      icon = 'bi-dot';
  }

  return (
    <span className={`badge rounded-pill px-2.5 py-1.5 fw-semibold d-inline-flex align-items-center gap-1 ${bgClass}`} style={{ fontSize: '0.78rem' }}>
      <i className={`bi ${icon}`}></i>
      <span>{status.replace(/_/g, ' ')}</span>
    </span>
  );
}

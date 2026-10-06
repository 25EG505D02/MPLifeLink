// API Client for LIFELINK Platform

const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('lifelink_token');

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('lifelink_token', token);
  } else {
    localStorage.removeItem('lifelink_token');
  }
};

export const getStoredUser = () => {
  const userJson = localStorage.getItem('lifelink_user');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem('lifelink_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('lifelink_user');
  }
};

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If unauthorized, clear token if expired
    if (!endpoint.includes('/auth/login')) {
      // Optional auto-logout on expired token
    }
  }

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errData = await response.json();
      errorMsg = errData.message || errData.error || response.statusText;
    } catch (e) {
      errorMsg = response.statusText || 'Server Error';
    }
    throw new Error(errorMsg);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// AUTH API
export const apiLogin = (email, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const apiRegister = (userData) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

// RESOURCES (SURPLUS) API
export const apiGetMyResources = () => request('/resources/my');
export const apiGetAllActiveResources = () => request('/resources');
export const apiGetExpiringSoon = () => request('/resources/expiring-soon');
export const apiGetResourceById = (id) => request(`/resources/${id}`);
export const apiCreateResource = (data) =>
  request('/resources', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const apiUpdateResource = (id, data) =>
  request(`/resources/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const apiDeleteResource = (id) =>
  request(`/resources/${id}`, { method: 'DELETE' });

// REQUESTS (REQUIREMENTS) API
export const apiGetMyRequests = () => request('/requests/my');
export const apiGetAllOpenRequests = () => request('/requests');
export const apiGetRequestById = (id) => request(`/requests/${id}`);
export const apiCreateRequest = (data) =>
  request('/requests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const apiCancelRequest = (id) =>
  request(`/requests/${id}`, { method: 'DELETE' });

// MATCHES API
export const apiGetProviderMatches = () => request('/matches/provider');
export const apiGetRecipientMatches = () => request('/matches/recipient');
export const apiGetResourceMatches = (resourceId) => request(`/matches/resource/${resourceId}`);
export const apiAcceptMatch = (matchId) =>
  request(`/matches/${matchId}/accept`, { method: 'POST' });
export const apiRejectMatch = (matchId) =>
  request(`/matches/${matchId}/reject`, { method: 'POST' });

// DELIVERIES API
export const apiGetMyDeliveries = () => request('/deliveries');
export const apiGetDeliveryById = (id) => request(`/deliveries/${id}`);
export const apiUpdateDeliveryStatus = (deliveryId, data) =>
  request(`/deliveries/${deliveryId}/status`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const apiConfirmReceipt = (deliveryId) =>
  request(`/deliveries/${deliveryId}/confirm-receipt`, { method: 'POST' });

// ADMIN API
export const apiGetAdminAnalytics = () => request('/admin/analytics');
export const apiGetAdminUsers = () => request('/admin/users');
export const apiToggleUserStatus = (userId, status) =>
  request(`/admin/users/${userId}/status?status=${status}`, { method: 'PUT' });
export const apiGetAdminVerifications = () => request('/admin/verifications');
export const apiVerifyOrganization = (profileId, type, approve) =>
  request(`/admin/verifications/${profileId}?type=${type}&approve=${approve}`, { method: 'PUT' });
export const apiGetAdminResources = () => request('/admin/resources');
export const apiGetAdminRequests = () => request('/admin/requests');
export const apiGetAdminDeliveries = () => request('/admin/deliveries');
export const apiGetAuditLogs = () => request('/admin/audit-logs');

// NOTIFICATIONS API
export const apiGetNotifications = () => request('/notifications');
export const apiGetUnreadCount = () => request('/notifications/unread-count');
export const apiMarkNotificationAsRead = (id) =>
  request(`/notifications/${id}/read`, { method: 'PUT' });
export const apiMarkAllNotificationsRead = () =>
  request('/notifications/read-all', { method: 'PUT' });

// PROFILE API
export const apiGetProfile = () => request('/profile');
export const apiUpdateProfile = (data) =>
  request('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

import { API_BASE_URL, getStoredTokens } from './authApi';

function getAuthHeaders() {
  const tokens = getStoredTokens();
  if (!tokens?.accessToken) {
    throw new Error('Not authenticated');
  }
  const tokenType = tokens.tokenType ?? 'Bearer';
  return {
    Authorization: `${tokenType} ${tokens.accessToken}`,
  };
}

async function request(path, options = {}) {
  const body = options.body;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const headers = {
    ...getAuthHeaders(),
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (_error) {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request to ${path} failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export const productApi = {
  list() {
    return request('/products', {
      method: 'GET',
    });
  },
  create(payload) {
    return request('/products', {
      method: 'POST',
      body: payload,
    });
  },
  update(id, payload) {
    return request(`/products/${id}`, {
      method: 'PUT',
      body: payload,
    });
  },
  remove(id) {
    return request(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

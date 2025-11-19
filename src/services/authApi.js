export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'https://ypg7ykfvbwreuowmqrxtk2zjua0clirn.lambda-url.us-east-2.on.aws';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: defaultHeaders,
    ...options,
  });

  let data;
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

export const authApi = {
  register(payload) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  confirmEmail(payload) {
    return request('/auth/confirm', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  resendConfirmation(payload) {
    return request('/auth/resend', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  login(payload) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  refresh(payload) {
    return request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  forgot(payload) {
    return request('/auth/forgot', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  confirmForgot(payload) {
    return request('/auth/forgot/confirm', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getProfile(payload) {
    return request('/auth/me', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  changePassword(payload) {
    return request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  logout(payload) {
    return request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

const TOKEN_STORAGE_KEY = 'jouhou-navi-tokens';
export const AUTH_CHANGE_EVENT = 'jouhou-auth-changed';

function emitAuthChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT));
}

export function persistTokens(tokens) {
  localStorage.setItem(
    TOKEN_STORAGE_KEY,
    JSON.stringify({
      accessToken: tokens.accessToken,
      idToken: tokens.idToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresIn
        ? Date.now() + tokens.expiresIn * 1000
        : null,
      tokenType: tokens.tokenType ?? 'Bearer',
    }),
  );
  emitAuthChange();
}

export function getStoredTokens() {
  const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

export function isAuthenticated() {
  const tokens = getStoredTokens();
  if (!tokens?.accessToken) return false;
  if (tokens.expiresAt && Date.now() >= tokens.expiresAt) return false;
  return true;
}

export function clearStoredTokens() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  emitAuthChange();
}

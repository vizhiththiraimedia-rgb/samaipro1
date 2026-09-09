const getBaseUrl = () => {
  return '';
};

export const getApiBaseUrl = () => getBaseUrl();

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('token');
    if (!local || local.split('.').length < 3) {
      return null;
    }
    return local;
  }
  return null;
};

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  // Normalize endpoint to always start with /api
  let targetEndpoint = endpoint;
  if (!targetEndpoint.startsWith('/api') && targetEndpoint !== '/health') {
    targetEndpoint = `/api${targetEndpoint}`;
  }

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!token && typeof window !== 'undefined' && window.location.pathname !== '/login') {
    // Skip forced redirect on localhost for easy testing
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      window.location.href = '/login';
      throw new Error('Not authenticated');
    }
  }

  const url = baseUrl ? `${baseUrl}${targetEndpoint}` : targetEndpoint;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = '';
    try {
      const errorData = await response.json();
      if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail.map((d: any) => d.msg || d.detail || JSON.stringify(d)).join(', ');
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else {
        errorMessage = JSON.stringify(errorData);
      }
    } catch {
      const rawText = await response.text().catch(() => '');
      errorMessage = `Server Error (${response.status}): ${rawText.substring(0, 100)}`;
    }

    if (response.status === 401) {
      removeToken();
      if (typeof window !== 'undefined') {
        // Optionally redirect to login, but removing the token is enough for the next refresh to use master key
        console.warn("Auth failed, token cleared.");
      }
    }
    throw new Error(errorMessage || `Server returned HTTP ${response.status}`);
  }

  return response.json();
};

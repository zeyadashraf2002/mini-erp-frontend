const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = {
  async request(endpoint, method = 'GET', body = null, token = null) {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const res = await fetch(`${API_URL}${endpoint}`, config);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'API Error');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  post(endpoint, body, token) {
    return this.request(endpoint, 'POST', body, token);
  },

  get(endpoint, token) {
    return this.request(endpoint, 'GET', null, token);
  },
};

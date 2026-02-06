const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Interceptor configuration
const interceptors = {
  request: [],
  response: [],
  error: []
};

export const api = {
  // Add request interceptor
  addRequestInterceptor(callback) {
    interceptors.request.push(callback);
  },

  // Add response interceptor
  addResponseInterceptor(callback) {
    interceptors.response.push(callback);
  },

  // Add error interceptor
  addErrorInterceptor(callback) {
    interceptors.error.push(callback);
  },

  async request(endpoint, method = 'GET', body = null, token = null) {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    // Run request interceptors
    for (const interceptor of interceptors.request) {
      config = await interceptor(config, endpoint) || config;
    }

    try {
      const res = await fetch(`${API_URL}${endpoint}`, config);
      let data;
      
      // Try to parse JSON, handle empty responses
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = { message: await res.text() };
      }

      // Run response interceptors
      for (const interceptor of interceptors.response) {
        data = await interceptor(data, res) || data;
      }

      if (!res.ok) {
        const error = new Error(data.message || `HTTP Error ${res.status}`);
        error.status = res.status;
        error.data = data;
        
        // Run error interceptors
        for (const interceptor of interceptors.error) {
          await interceptor(error, res);
        }
        
        throw error;
      }

      return data;
    } catch (error) {
      // Run error interceptors for network errors
      if (!error.status) {
        for (const interceptor of interceptors.error) {
          await interceptor(error, null);
        }
      }
      throw error;
    }
  },

  post(endpoint, body, token) {
    return this.request(endpoint, 'POST', body, token);
  },

  get(endpoint, token) {
    return this.request(endpoint, 'GET', null, token);
  },

  put(endpoint, body, token) {
    return this.request(endpoint, 'PUT', body, token);
  },

  delete(endpoint, token) {
    return this.request(endpoint, 'DELETE', null, token);
  },

  patch(endpoint, body, token) {
    return this.request(endpoint, 'PATCH', body, token);
  }
};

// Default interceptors
// Log all requests in development
if (process.env.NODE_ENV === 'development') {
  api.addRequestInterceptor((config, endpoint) => {
    console.log(`[API Request] ${config.method} ${endpoint}`, config);
    return config;
  });

  api.addResponseInterceptor((data, res) => {
    console.log(`[API Response] ${res.status}`, data);
    return data;
  });

  api.addErrorInterceptor((error, res) => {
    console.error(`[API Error]`, {
      message: error.message,
      status: error.status,
      data: error.data
    });
  });
}

// Handle 401 Unauthorized globally
api.addErrorInterceptor((error) => {
  if (error.status === 401) {
    // Clear token and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
  }
});

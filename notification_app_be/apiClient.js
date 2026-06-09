const axios = require('axios');
const config = require('./config/env');
const tokenManager = require('./auth/tokenManager');
const { log } = require('../logging_middleware/logger');

// Create Axios Instance
const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Inject Bearer Token
apiClient.interceptors.request.use(
  async (req) => {
    // Skip injecting token for registration and authentication calls
    if (req.url.includes('/evaluation-service/register') || req.url.includes('/evaluation-service/auth')) {
      return req;
    }

    try {
      const token = await tokenManager.getValidToken();
      req.headers['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      await log('backend', 'error', 'api', `Failed to inject authorization header: ${error.message}`);
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Auto-Retry on 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if unauthorized and request is eligible for retry
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      await log('backend', 'warn', 'api', 'API responded with 401 Unauthorized. Token may be expired. Invalidating and refreshing token.');
      tokenManager.invalidateToken();

      try {
        // Fetch new token, which automatically updates config/process.env
        const freshToken = await tokenManager.getValidToken();
        originalRequest.headers['Authorization'] = `Bearer ${freshToken}`;
        
        await log('backend', 'info', 'api', 'Retrying original API request with renewed credentials.');
        return apiClient(originalRequest);
      } catch (retryError) {
        await log('backend', 'fatal', 'api', `Failed to re-authenticate during retry flow: ${retryError.message}`);
        return Promise.reject(retryError);
      }
    }

    // Standard API error logging
    const status = error.response ? error.response.status : 'NETWORK_ERROR';
    const errorDetails = error.response ? JSON.stringify(error.response.data) : error.message;
    await log('backend', 'error', 'api', `API Request failed [Status: ${status}]: ${errorDetails}`);

    return Promise.reject(error);
  }
);

module.exports = apiClient;

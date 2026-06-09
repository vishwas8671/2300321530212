import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://4.224.186.213';
const LOGS_API_URL = process.env.NEXT_PUBLIC_LOGS_API_URL || 'http://4.224.186.213/evaluation-service/logs';

/**
 * Reusable Front-end Structured Logger.
 * Emits telemetry directly to the AffordMed Logs API.
 */
export async function logFrontend(
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal',
  packageName: string,
  message: string
): Promise<boolean> {
  const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN || '';
  const sanitizedMessage = message.length > 48 ? message.slice(0, 45) + '...' : message;
  const payload = {
    stack: 'frontend',
    level,
    package: packageName,
    message: sanitizedMessage,
    timestamp: new Date().toISOString()
  };

  const consoleOutput = `[${payload.timestamp}] [FRONTEND] [${level.toUpperCase()}] [${packageName}] - ${message}`;

  if (!token || token === 'your_jwt_access_token_here' || token.trim() === '') {
    // If token is not provided, fallback to console log gracefully
    console.warn(`[Logger Warning] NEXT_PUBLIC_ACCESS_TOKEN is not configured. Falling back to console.`);
    console.log(consoleOutput);
    return false;
  }

  const sendRequest = async () => {
    const response = await fetch(LOGS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Logs API responded with status ${response.status}`);
    }
    return true;
  };

  try {
    await sendRequest();
    return true;
  } catch (error: any) {
    console.warn(`[Logger Warning] Frontend log failed to transmit: ${error.message}. Retrying once...`);
    try {
      await sendRequest();
      return true;
    } catch (retryError: any) {
      console.error(`[Logger Error] Frontend log failed after retry: ${retryError.message}`);
      console.log(`[FALLBACK CONSOLE] ${consoleOutput}`);
      return false;
    }
  }
}

// Create Axios Instance for Frontend API calls
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Inject Token
api.interceptors.request.use(
  (config) => {
    const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
    if (token && token !== 'your_jwt_access_token_here' && token.trim() !== '') {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Log errors and support basic retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If request fails and hasn't been retried yet (retry once on network/timeout errors)
    if (error.code === 'ECONNABORTED' || !error.response) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        await logFrontend('warn', 'api', `Network timeout or failure. Retrying request to: ${originalRequest.url}`);
        return api(originalRequest);
      }
    }

    const status = error.response ? error.response.status : 'NETWORK_ERROR';
    const errorDetails = error.response ? JSON.stringify(error.response.data) : error.message;

    await logFrontend('error', 'api', `API Request failed [Status: ${status}] on route: ${originalRequest.url}. Details: ${errorDetails}`);
    
    return Promise.reject(error);
  }
);

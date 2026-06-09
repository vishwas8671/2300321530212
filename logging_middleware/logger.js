const { VALID_STACKS, VALID_LEVELS } = require('./constants');

/**
 * Sends a structured log message to the AffordMed Logs API.
 * 
 * @param {string} stack - The stack name ("frontend" or "backend")
 * @param {string} level - The log level ("debug", "info", "warn", "error", "fatal")
 * @param {string} packageName - The name of the package/module sending the log
 * @param {string} message - The log message text
 * @returns {Promise<boolean>} Resolves to true if the log was successfully sent, false otherwise.
 */
async function log(stack, level, packageName, message) {
  // 1. Input Validation
  if (!VALID_STACKS.includes(stack)) {
    console.error(`[Logger Error] Invalid stack: "${stack}". Must be one of: ${VALID_STACKS.join(', ')}`);
    return false;
  }
  if (!VALID_LEVELS.includes(level)) {
    console.error(`[Logger Error] Invalid level: "${level}". Must be one of: ${VALID_LEVELS.join(', ')}`);
    return false;
  }
  if (!packageName || typeof packageName !== 'string' || packageName.trim() === '') {
    console.error(`[Logger Error] Package name must be a non-empty string. Got: "${packageName}"`);
    return false;
  }
  if (!message || typeof message !== 'string' || message.trim() === '') {
    console.error(`[Logger Error] Message must be a non-empty string. Got: "${message}"`);
    return false;
  }

  // 2. Load Configuration from Environment
  // Support both standard Node process.env and frontend NEXT_PUBLIC prefix if applicable
  const token = process.env.ACCESS_TOKEN || process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  const rawApiUrl = process.env.LOGS_API_URL || process.env.NEXT_PUBLIC_LOGS_API_URL || 'http://4.224.186.213/evaluation-service/logs';
  
  // Format Log Payload (Truncate message if it exceeds 48 characters due to API constraints)
  const sanitizedMessage = message.length > 48 ? message.slice(0, 45) + '...' : message;
  const payload = {
    stack,
    level,
    package: packageName,
    message: sanitizedMessage,
    timestamp: new Date().toISOString()
  };

  // Structured console output for local debugging (only if debug/test mode or if API fails)
  const consoleOutput = `[${payload.timestamp}] [${stack.toUpperCase()}] [${level.toUpperCase()}] [${packageName}] - ${message}`;

  // If no token is provided, warn and log to console, but don't crash
  if (!token) {
    // Write to console if API is unavailable or environment is missing token
    console.warn(`[Logger Warning] ACCESS_TOKEN not configured. Logging to console instead.`);
    console.log(consoleOutput);
    return false;
  }

  // Define the api call function
  const sendRequest = async () => {
    // We use globalThis.fetch which is supported in Node 18+ and Next.js/Browser environment.
    const response = await fetch(rawApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch (_) {}
      throw new Error(`AffordMed Logs API responded with status ${response.status}: ${response.statusText || ''}. Details: ${errorBody}`);
    }

    return true;
  };

  // 3. Execute with Retry Once on Failure
  try {
    await sendRequest();
    return true;
  } catch (error) {
    // Print the first failure silently to terminal (warning)
    console.warn(`[Logger Warning] Log transmission failed: ${error.message}. Retrying once...`);
    
    try {
      // Retry once
      await sendRequest();
      return true;
    } catch (retryError) {
      // Graceful error handling: fall back to console logging so logs are not completely lost
      console.error(`[Logger Error] Failed to send log to API after retry: ${retryError.message}`);
      console.log(`[FALLBACK CONSOLE] ${consoleOutput}`);
      return false;
    }
  }
}

module.exports = { log };

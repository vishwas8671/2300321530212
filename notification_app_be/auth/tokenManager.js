const config = require('../config/env');
const { runAuthenticate } = require('./authenticate');
const { log } = require('../../logging_middleware/logger');

let cachedToken = config.ACCESS_TOKEN;

/**
 * Retrieves a valid ACCESS_TOKEN. If not set or invalid, triggers
 * authentication workflow dynamically and caches the token.
 * 
 * @returns {Promise<string>} The active access token
 */
async function getValidToken() {
  if (cachedToken && cachedToken !== 'your_jwt_access_token_here' && cachedToken.trim() !== '') {
    return cachedToken;
  }

  await log('backend', 'warn', 'auth', 'Access token is missing or placeholder. Triggering automatic authentication.');
  console.log('Access token is missing or placeholder. Running authentication flow...');
  
  try {
    const freshToken = await runAuthenticate();
    cachedToken = freshToken;
    
    // Update process.env dynamically so other components have immediate access
    process.env.ACCESS_TOKEN = freshToken;
    config.ACCESS_TOKEN = freshToken;
    
    await log('backend', 'info', 'auth', 'New access token successfully retrieved and cached.');
    return freshToken;
  } catch (error) {
    await log('backend', 'fatal', 'auth', `Failed to dynamically obtain access token: ${error.message}`);
    throw new Error(`Authentication token manager failed to obtain a token: ${error.message}`);
  }
}

/**
 * Invalidates the current cached token to force a refresh on the next request.
 */
function invalidateToken() {
  cachedToken = null;
  process.env.ACCESS_TOKEN = '';
  config.ACCESS_TOKEN = '';
}

module.exports = {
  getValidToken,
  invalidateToken
};

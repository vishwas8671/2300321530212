const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  API_BASE_URL: process.env.API_BASE_URL || 'http://4.224.186.213',
  LOGS_API_URL: process.env.LOGS_API_URL || 'http://4.224.186.213/evaluation-service/logs',
};

// Check for required environment variables
const missing = [];
if (!config.CLIENT_ID) missing.push('CLIENT_ID');
if (!config.CLIENT_SECRET) missing.push('CLIENT_SECRET');

if (missing.length > 0) {
  console.warn(`[Config Warning] Missing environment variables: ${missing.join(', ')}.`);
  console.warn(`Please set them in notification_app_be/.env or environment scope.`);
}

module.exports = config;

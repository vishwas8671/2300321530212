/**
 * Constants defining the allowed configurations for the Campus Notifications Platform logging system.
 */

const STACKS = {
  FRONTEND: 'frontend',
  BACKEND: 'backend',
};

const LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
};

const PACKAGES = {
  COMPONENT: 'component',
  SERVICE: 'service',
  CONTROLLER: 'controller',
  MIDDLEWARE: 'middleware',
  API: 'api',
  UTILS: 'utils',
};

module.exports = {
  STACKS,
  LEVELS,
  PACKAGES,
  VALID_STACKS: Object.values(STACKS),
  VALID_LEVELS: Object.values(LEVELS),
  VALID_PACKAGES: Object.values(PACKAGES),
};

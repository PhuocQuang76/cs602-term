'use strict';
/*
 * Load all configuration files inside the config folder.
 * These configuration files are necessary to run the application
 * depending on the NODE_ENV variable.  The different configurations
 * must be the same file names as the NODE_ENV environment variable.
 */
let config = {
  local: require('./local'),
  mamp: require('./mamp')
};

//If the NODE_ENV variable does not exist, use the default "local" configuration.
//This assumes that your program is running locally.
let cfg = config[process.env.NODE_ENV||'local'];

module.exports = cfg;
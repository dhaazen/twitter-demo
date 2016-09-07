'use strict';
/*eslint no-process-env:0*/

import path from 'path';

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // Browser-sync port
  browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  twitterClientKey: process.env.TWITTER_CLIENT_KEY,

  twitterClientSecret: process.env.TWITTER_CLIENT_SECRET
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = all;

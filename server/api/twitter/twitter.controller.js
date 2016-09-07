/**
 * GET     /api/twitter  ->  index
 */

'use strict';

import https from 'https';
import config from '../../config/environment';
import querystring from 'querystring';

let accessToken;

// Constants
const TWITTER_HOSTNAME = 'api.twitter.com';
const TWEET_COUNT = 10;
const SCREEN_NAME = 'salesforce';

// Request the initial access token on startup
requestToken(token => {
  accessToken = token;
});

// Return latest 10 tweets from Twitter API
export function index(req, res) {
  if(accessToken) {
    requestTwitterData(twitterData => res.send(twitterData));
  } else {
    // Request token
    requestToken(token => {
      accessToken = token;
      requestTwitterData(twitterData => res.send(twitterData));
    });
  }
}

// Will request Data from Twitter API
function requestTwitterData(cb) {
  const getParams = querystring.stringify({
    screen_name: SCREEN_NAME,
    count: TWEET_COUNT
  });

  const options = {
    hostname: TWITTER_HOSTNAME,
    path: `/1.1/statuses/user_timeline.json?${getParams}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };

  // Create request
  var twitterReq = https.request(options, twitterRes => {
    let responseData = '';

    twitterRes.setEncoding('utf8');

    twitterRes.on('data', chunk => {
      responseData += chunk;
    });

    twitterRes.on('end', () => {
      cb(JSON.parse(responseData));
    });
  });

  twitterReq.on('error', e => {
    console.log(`problem with request: ${e.message}`);
  });

  twitterReq.end();
}

// This function will hit the Twitter OAuth endpoint and
// Store the returned access Token
function requestToken(cb) {
  const postData = querystring.stringify({
    grant_type: 'client_credentials'
  });

  const options = {
    hostname: TWITTER_HOSTNAME,
    path: '/oauth2/token',
    method: 'POST',
    auth: `${config.twitterClientKey}:${config.twitterClientSecret}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  let token;

  // Create Request to Twitter OAuth Endpoint
  var req = https.request(options, res => {
    res.setEncoding('utf8');

    res.on('data', chunk => {
      token = JSON.parse(chunk).access_token;
    });

    res.on('end', () => {
      cb(token);
    });
  });

  req.on('error', e => {
    console.log(`problem with request: ${e.message}`);
  });

  // write data to request body
  req.write(postData);
  req.end();
}

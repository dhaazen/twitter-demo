import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './main.routes';

export class MainController {

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.filterText = {
      text: ''
    };
  }

  // When the controller is initialized query for
  // Twitter Data and begin Polling timer
  $onInit() {
    this._getCurrentData(response => {
      this.twitterData = this._formatResponse(response);
    }).bind(this)();

    this.timer = setInterval(this._getCurrentData(response => {
      this.twitterData = this._formatResponse(response);
    }).bind(this), 60 * 1000);
  }

  // Returns a function which gets the current
  // Twitter data will need to bind to parent
  // to access $http
  _getCurrentData(cb) {
    return function() {
      this.$http.get('/api/twitter')
        .then(response => {
          cb(response.data);
        });
    };
  }

  // Formats the received twitter data adding in links
  // as needed
  _formatResponse(twitterData) {
    let formattedTwitterData = {};

    formattedTwitterData = twitterData.map(tweet => {
      if(tweet.text) {
        tweet = this._grabLinkToTweet(tweet);
        tweet.text = this._replaceTweetLinks(tweet);
        tweet.text = this._replaceUsernameReferences(tweet);
        tweet.text = this._replaceHashTags(tweet);
      }

      return tweet;
    });


    return formattedTwitterData;
  }

  // This will remove the last link from tweet text and
  // add it to the body as a tweetLink attribute
  _grabLinkToTweet(tweet) {
    let textArr = tweet.text.split(' ');
    tweet.tweetLink = textArr.pop();
    tweet.text = textArr.join(' ');
    return tweet;
  }

  // Parse tweet text for any links and replaces
  // with hyperlinks with display text
  _replaceTweetLinks(tweet) {
    const httpRegEx = /https?:\/\/[^ ]*/g;

    let match;
    let matchArr = [];

    // Put all matches in array
    while((match = httpRegEx.exec(tweet.text)) !== null) {
      matchArr.push(match[0]);
    }

    // Replace all matches
    matchArr.forEach((url, i) => {
      tweet.text = tweet.text.replace(url,
        `<a href="${url}">${tweet.entities.urls[i].display_url}</a>`);
    });

    return tweet.text;
  }

  // Parse tweet text for any username references
  // and replaces with hyperlinks
  _replaceUsernameReferences(tweet) {
    const atRegEx = /@\w*/g;

    let match;
    let matchArr = [];

    // Put all matches in array
    while((match = atRegEx.exec(tweet.text)) !== null) {
      matchArr.push(match[0]);
    }

    // Replace all matches
    matchArr.forEach(user => {
      tweet.text = tweet.text.replace(user,
        `<a href="https://twitter.com/${user.slice(1)}">${user}</a>`);
    });

    return tweet.text;
  }

  // Parse tweet text for any hash tag references
  // and replaces with hyperlinks
  _replaceHashTags(tweet) {
    const hashTagRegEx = /#\w*/g;

    let match;
    let matchArr = [];

    // Put all matches in array
    while((match = hashTagRegEx.exec(tweet.text)) !== null) {
      matchArr.push(match[0]);
    }

    // Replace all matches
    matchArr.forEach(hashTag => {
      tweet.text = tweet.text.replace(hashTag,
        `<a href="https://twitter.com/hashtag/${hashTag.slice(1)}?src=hash">${hashTag}</a>`);
    });

    return tweet.text;
  }

  // Clear timer when controller is destroyed.
  $onDestroy() {
    clearInterval(this.timer);
  }
}

export default angular.module('newProjectApp.main', [ngRoute])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;

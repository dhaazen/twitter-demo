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

    formattedTwitterData = twitterData.map((tweet) => {
      if(tweet.text) {
        tweet = _grabLinkToTweet(tweet);
        tweet.text = this._replaceTweetLinks(tweet);
        tweet.text = this._replaceUsernameReferences(tweet);
        tweet.text = this._replaceHashTags(tweet);
      }

      return tweet;
    });


    return formattedTwitterData;
  }

  _grabLinkToTweet(tweet) {
    let textArr = tweet.text.split(' ');
    tweet.tweetLink = textArr.pop();
    tweet.text = textArr.join(' ');
    return tweet;
  }

  _replaceTweetLinks(tweet) {

    const httpRegEx = /https?:\/\/[^ ]*/g;

    let match, matchArr = [];

    // Replace links with display text
    while((match = httpRegEx.exec(tweet.text)) !== null) {
      matchArr.push(match[0]);
    }

    matchArr.forEach((url, i) => {
      tweet.text = tweet.text.replace(url,
        `<a href="${url}">${tweet.entities.urls[i].display_url}</a>`);
    });

    return tweet.text;
  }

  _replaceUsernameReferences(tweet) {
    const atRegEx = /@\w*/g;

    var newText, matchArr;

    // Replace @ mentions with links to users
    while((matchArr = atRegEx.exec(tweet.text)) !== null) {
      console.log('@ Match');
      newText = tweet.text.replace(matchArr[0],
        `<a href="https://twitter.com/${matchArr[0].slice(1)}">${matchArr[0]}</a>`);
    }

    return newText || tweet.text;
  }

  _replaceHashTags(tweet) {
    const hashTagRegEx = /#\w*/g;

    var newText, matchArr;

    // Replace hashtag mentions with links to twitter Hashtags
    while((matchArr = hashTagRegEx.exec(tweet.text)) !== null) {
      console.log('# Match');
      newText = tweet.text.replace(matchArr[0],
        `<a href="https://twitter.com/hashtag/${matchArr[0].slice(1)}?src=hash">${matchArr[0]}</a>`);
    }

    return newText || tweet.text;
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

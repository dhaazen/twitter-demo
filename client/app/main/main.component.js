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
      console.log(response)
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

    formattedTwitterData = twitterData.map((tweet, i) => {
      let newTweet = tweet;
      let textArr = tweet.text.split(' ');
      const httpRegEx = /https:\/\/.*/;
      const atRegEx = /@\w*/g;

      newTweet.tweetLink = textArr.pop();
      newTweet.text = textArr.join(' ');

      // Replace links with display text
      while(newTweet.text.match(httpRegEx)){
        newTweet.text = newTweet.text.replace(httpRegEx, 
          `<a href="${tweet.entities.urls[0].expanded_url}">${tweet.entities.urls[0].display_url}</a>`);
      }

      var matchArr;
      var textBuffer;

      // Replace @ mentions with links to users
      while((matchArr = atRegEx.exec(newTweet.text)) !== null) {
        textBuffer = newTweet.text.replace(matchArr[0], 
          `<a href="https://twitter.com/${matchArr[0].slice(1)}">${matchArr[0]}</a>`);
      }

      newTweet.text = textBuffer || newTweet.text;

      return newTweet;
    });


    return formattedTwitterData;
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

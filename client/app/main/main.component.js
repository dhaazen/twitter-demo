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
    this.getCurrentData(response => (this.twitterData = response)).bind(this)();
    this.timer = setInterval(this.getCurrentData(response => (this.twitterData = response)).bind(this), 60 * 1000);
  }

  // Returns a function which gets the current
  // Twitter data will need to bind to parent
  // to access $http
  getCurrentData(cb) {
    return function() {
      this.$http.get('/api/twitter')
        .then(response => {
          cb(response.data);
        });
    }
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

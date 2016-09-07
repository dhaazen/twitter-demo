'use strict';

import angular from 'angular';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

const ngRoute = require('angular-route');


import {
  routeConfig
} from './app.config';

import footer from '../components/footer/footer.component';
import main from './main/main.component';

import './app.css';

angular.module('newProjectApp', [ngCookies, ngResource, ngSanitize, ngRoute, footer, main
  ])
  .config(routeConfig);

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['newProjectApp'], {
      strictDi: true
    });
  });
